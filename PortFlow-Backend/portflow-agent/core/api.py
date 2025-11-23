"""REST API definitions for the PortFlow clearing agent.

This module wires Django Ninja routers that expose endpoints for container
operations, customs, shipping, inspection workflows and watsonx integration.
"""

from ninja import NinjaAPI, Router, UploadedFile, File
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Container
from .schemas import (
    ContainerSchema,
    ContainerCreateSchema,
    ContainerListSchema,
    ValidationRequestSchema,
    ValidationResponseSchema,
    CustomsPaymentRequestSchema,
    CustomsPaymentResponseSchema,
    CustomsStatusResponseSchema,
    ShippingStatusResponseSchema,
    InspectionScheduleRequestSchema,
    InspectionScheduleResponseSchema,
    ErrorSchema,
    SuccessSchema,
)
from .utils import BillOfLadingParser, validate_container_data
from .watsonx_auth import auth_manager
from datetime import datetime
from decimal import Decimal
from typing import List

api = NinjaAPI(
    title="PortFlow Clearing Agent API",
    version="1.0.0",
    description="AI-powered digital clearing agent for Lagos ports",
)

router = Router(tags=["Container Operations"])

@router.post("/upload", response={200: ContainerCreateSchema, 400: ErrorSchema, 500: ErrorSchema})
def upload_bill_of_lading(request, file: UploadedFile = File(...)):
    """Upload a Bill of Lading document and create a container.

    The uploaded PDF is parsed to extract container data, which is then
    validated and stored. Returns the created container identifier and
    current status.
    """
    try:
        if not file.name.lower().endswith('.pdf'):
            return 400, {"error": "Invalid file type", "details": "Only PDF files are accepted"}
        
        file_content = file.read()
        
        parser = BillOfLadingParser()
        parse_result = parser.parse_bill_of_lading(file_content, file.name)
        
        if not parse_result["success"]:
            return 400, {
                "error": "Document parsing failed",
                "details": "; ".join(parse_result["errors"])
            }
        
        data = parse_result["data"]
        
        existing = Container.objects.filter(container_id=data["container_id"]).first()
        if existing:
            return 400, {
                "error": "Container already exists",
                "details": f"Container {data['container_id']} is already in the system"
            }
        
        validation_errors = validate_container_data(data)
        
        # Create container record
        container = Container.objects.create(
            container_id=data["container_id"],
            vessel_name=data.get("vessel_name"),
            importer_name=data.get("importer_name"),
            importer_address=data.get("importer_address"),
            tin=data.get("tin"),
            port_of_loading=data.get("port_of_loading"),
            port_of_discharge=data.get("port_of_discharge", "Lagos, Nigeria"),
            cargo_description=data.get("cargo_description"),
            cargo_weight=data.get("cargo_weight"),
            original_filename=file.name,
            document_validated=len(validation_errors) == 0,
            validation_errors=validation_errors,
            overall_status=Container.OverallStatus.PENDING_VALIDATION,
            shipping_status=Container.ShippingStatus.DISCHARGED,
            customs_status=Container.CustomsStatus.PENDING
        )
        
        container.add_log(
            actor="system",
            action="document_upload",
            details=f"Bill of Lading uploaded: {file.name}"
        )
        
        return 200, {
            "container_id": container.container_id,
            "overall_status": container.overall_status,
            "message": "Document uploaded and parsed successfully"
        }
        
    except Exception as e:
        return 500, {"error": "Server error", "details": str(e)}


@router.get("/containers/{container_id}", response={200: ContainerSchema, 404: ErrorSchema})
def get_container_status(request, container_id: str):
    """Return current status and complete information for a container.

    This is the primary endpoint for checking progress through the
    clearance workflow.
    """
    try:
        container = get_object_or_404(Container, container_id=container_id)
        return 200, container
    except Exception as e:
        return 404, {"error": "Container not found", "details": str(e)}


@router.get("/containers", response={200: ContainerListSchema})
def list_containers(request, status: str = None, limit: int = 100):
    """List containers, optionally filtered by overall status.

    Parameters are provided as query arguments on the request.
    """
    query = Container.objects.all()
    
    if status:
        query = query.filter(overall_status=status)
    
    containers = query[:limit]
    
    return {
        "containers": list(containers),
        "count": containers.count()
    }


@router.post("/validate", response={200: ValidationResponseSchema, 404: ErrorSchema})
def validate_container(request, payload: ValidationRequestSchema):
    """Validate a container's documentation and update its status.

    Intended to be called by the AI agent after document upload.
    """
    container = get_object_or_404(Container, container_id=payload.container_id)
    
    # Re-validate if forced or not yet validated
    if payload.force_revalidate or not container.document_validated:
        errors = validate_container_data({
            "container_id": container.container_id,
            "vessel_name": container.vessel_name,
            "importer_name": container.importer_name,
            "tin": container.tin
        })
        
        container.validation_errors = errors
        container.document_validated = len(errors) == 0
        
        if container.document_validated:
            container.overall_status = Container.OverallStatus.VALIDATED
            container.add_log(
                actor="agent",
                action="validation",
                details="Document validation passed"
            )
        else:
            container.add_log(
                actor="agent",
                action="validation_failed",
                details=f"Validation errors: {', '.join(errors)}"
            )
        
        container.save()
    
    return {
        "container_id": container.container_id,
        "is_valid": container.document_validated,
        "errors": container.validation_errors,
        "message": "Validation successful" if container.document_validated else "Validation failed"
    }


customs_router = Router(tags=["Customs Operations"])

@customs_router.get("/status/{container_id}", response={200: CustomsStatusResponseSchema, 404: ErrorSchema})
def check_customs_status(request, container_id: str):
    """Check the customs clearance status for a container.

    This simulates querying the Nigerian Customs Service and computing any
    customs duty owed.
    """
    container = get_object_or_404(Container, container_id=container_id)
    

    if container.customs_duty_amount is None:
        if container.cargo_weight:
            estimated_value = float(container.cargo_weight) * 100
            container.customs_duty_amount = Decimal(estimated_value * 0.10)
        else:
            container.customs_duty_amount = Decimal('150000.00')
        
        if container.customs_status == Container.CustomsStatus.PENDING:
            container.customs_status = Container.CustomsStatus.PAYMENT_REQUIRED
        
        container.save()
    
    amount_due = container.customs_duty_amount if container.customs_status == Container.CustomsStatus.PAYMENT_REQUIRED else None
    
    return {
        "container_id": container.container_id,
        "customs_status": container.customs_status,
        "amount_due": amount_due,
        "message": f"Customs duty: ₦{container.customs_duty_amount:,.2f}" if amount_due else "Customs cleared"
    }


@customs_router.post("/pay", response={200: CustomsPaymentResponseSchema, 400: ErrorSchema, 404: ErrorSchema})
def pay_customs_duty(request, payload: CustomsPaymentRequestSchema):
    """Process customs duty payment for a container.

    The agent should call this after informing the user of the amount due
    and receiving confirmation to proceed.
    """
    container = get_object_or_404(Container, container_id=payload.container_id)
    
    if container.customs_status == Container.CustomsStatus.PAID:
        return 400, {"error": "Already paid", "details": "Customs duty has already been paid"}
    
    if container.customs_duty_amount and payload.amount < container.customs_duty_amount:
        return 400, {
            "error": "Insufficient payment",
            "details": f"Amount due: ₦{container.customs_duty_amount:,.2f}"
        }
    
    # Process payment (we mock this for now)
    container.customs_status = Container.CustomsStatus.PAID
    container.customs_paid_at = datetime.now()
    container.overall_status = Container.OverallStatus.CUSTOMS_CLEARED
    
    payment_ref = payload.payment_reference or f"PAY{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    container.add_log(
        actor="agent",
        action="customs_payment",
        details=f"Customs duty paid: ₦{payload.amount:,.2f}. Reference: {payment_ref}"
    )
    
    container.save()
    
    return {
        "container_id": container.container_id,
        "status": container.customs_status,
        "amount_paid": payload.amount,
        "payment_date": container.customs_paid_at,
        "message": "Customs duty payment processed successfully"
    }


shipping_router = Router(tags=["Shipping Operations"])

@shipping_router.get("/status/{container_id}", response={200: ShippingStatusResponseSchema, 404: ErrorSchema})
def check_shipping_status(request, container_id: str):
    """Check the shipping or vessel status for a container.

    This simulates querying the Nigerian Ports Authority (NPA) system.
    """
    container = get_object_or_404(Container, container_id=container_id)
    
    container.add_log(
        actor="agent",
        action="shipping_status_check",
        details=f"Shipping status queried: {container.shipping_status}"
    )
    
    return {
        "container_id": container.container_id,
        "shipping_status": container.shipping_status,
        "vessel_name": container.vessel_name,
        "port_of_discharge": container.port_of_discharge,
        "message": f"Container is {container.shipping_status.lower().replace('_', ' ')}"
    }


inspection_router = Router(tags=["Inspection Operations"])

@inspection_router.post("/schedule", response={200: InspectionScheduleResponseSchema, 400: ErrorSchema, 404: ErrorSchema})
def schedule_inspection(request, payload: InspectionScheduleRequestSchema):
    """Schedule a physical inspection with the Nigerian Ports Authority.

    The agent should call this after customs clearance to arrange
    inspection.
    """
    container = get_object_or_404(Container, container_id=payload.container_id)
    
    if container.customs_status != Container.CustomsStatus.PAID:
        return 400, {
            "error": "Customs not cleared",
            "details": "Customs duty must be paid before scheduling inspection"
        }
    
    if container.inspection_status == Container.InspectionStatus.SCHEDULED:
        return 400, {"error": "Already scheduled", "details": "Inspection is already scheduled"}
    
    # Schedule inspection (we mock this for now)
    container.inspection_status = Container.InspectionStatus.SCHEDULED
    container.overall_status = Container.OverallStatus.PENDING_INSPECTION
    
    # Generate a mock scheduled date (tomorrow at 10 AM)
    from datetime import timedelta
    scheduled_date = (datetime.now() + timedelta(days=1)).replace(hour=10, minute=0, second=0)
    scheduled_date_str = scheduled_date.strftime("%Y-%m-%dT%H:%M:%S")
    
    container.add_log(
        actor="agent",
        action="inspection_scheduled",
        details=f"Physical inspection scheduled for {scheduled_date_str}"
    )
    
    container.save()
    
    return {
        "container_id": container.container_id,
        "inspection_status": container.inspection_status,
        "scheduled_date": scheduled_date_str,
        "message": f"Inspection scheduled for {scheduled_date.strftime('%B %d, %Y at %I:%M %p')}"
    }


@inspection_router.post("/complete/{container_id}", response={200: SuccessSchema, 404: ErrorSchema})
def complete_inspection(request, container_id: str, passed: bool = True):
    """Mark an inspection as completed.

    This is primarily a utility endpoint for demo purposes.
    """
    container = get_object_or_404(Container, container_id=container_id)
    
    if passed:
        container.inspection_status = Container.InspectionStatus.PASSED
        container.overall_status = Container.OverallStatus.INSPECTION_PASSED
        container.add_log(
            actor="npa_inspector",
            action="inspection_passed",
            details="Physical inspection completed successfully"
        )
    else:
        container.inspection_status = Container.InspectionStatus.FAILED
        container.overall_status = Container.OverallStatus.FAILED
        container.add_log(
            actor="npa_inspector",
            action="inspection_failed",
            details="Physical inspection failed"
        )
    
    container.save()
    
    return {
        "message": f"Inspection marked as {'passed' if passed else 'failed'}",
        "data": {"container_id": container_id, "status": container.inspection_status}
    }


@inspection_router.post("/release/{container_id}", response={200: SuccessSchema, 400: ErrorSchema, 404: ErrorSchema})
def release_container(request, container_id: str):
    """Release a container for pickup after all clearances are complete.

    The agent should call this after inspection passes.
    """
    container = get_object_or_404(Container, container_id=container_id)
    
    if container.inspection_status != Container.InspectionStatus.PASSED:
        return 400, {
            "error": "Inspection not passed",
            "details": "Container must pass inspection before release"
        }
    
    container.overall_status = Container.OverallStatus.RELEASED
    container.shipping_status = Container.ShippingStatus.READY_FOR_PICKUP
    
    container.add_log(
        actor="agent",
        action="container_released",
        details="Container cleared and released for pickup"
    )
    
    container.save()
    
    return {
        "message": "Container released successfully",
        "data": {
            "container_id": container_id,
            "status": container.overall_status,
            "ready_for_pickup": True
        }
    }


api.add_router("/api", router)
api.add_router("/api/customs", customs_router)
api.add_router("/api/shipping", shipping_router)
api.add_router("/api/inspection", inspection_router)

watsonx_router = Router(tags=["watsonx Orchestrate"])

@watsonx_router.get("/token")
def get_watsonx_token(request):
    """Generate an authentication token for the watsonx Orchestrate widget.

    Provides session tokens for the embedded chat widget. In production this
    should first validate that the user is authenticated.
    """

    user_id = getattr(request.user, 'id', None) if hasattr(request, 'user') else None
    
    # Generate session token
    token_data = auth_manager.generate_session_token(
        user_id=str(user_id) if user_id else "anonymous",
        session_data={
            'timestamp': datetime.utcnow().isoformat(),
            'source': 'portflow_web'
        }
    )
    
    return token_data

@watsonx_router.get("/config")
def get_watsonx_config(request):
    """Return watsonx Orchestrate widget configuration.

    Returns the configuration required to initialise the chat widget on the
    frontend.
    """

    config = auth_manager.get_widget_config(anonymous=True)
    
    return config

api.add_router("/api/watsonx", watsonx_router)
