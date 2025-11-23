from ninja import Schema
from typing import List, Optional, Any
from datetime import datetime
from decimal import Decimal

class LogEntrySchema(Schema):
    """Schema for individual log entries in the container workflow"""
    timestamp: str
    actor: str
    action: str
    details: str

class ContainerSchema(Schema):
    """Complete container information schema"""
    container_id: str
    overall_status: str
    vessel_name: Optional[str] = None
    importer_name: Optional[str] = None
    importer_address: Optional[str] = None
    tin: Optional[str] = None
    port_of_loading: Optional[str] = None
    port_of_discharge: Optional[str] = None
    cargo_description: Optional[str] = None
    cargo_weight: Optional[Decimal] = None
    customs_status: str
    shipping_status: str
    inspection_status: str
    customs_duty_amount: Optional[Decimal] = None
    customs_paid_at: Optional[datetime] = None
    original_filename: Optional[str] = None
    document_validated: bool
    validation_errors: List[str]
    logs: List[LogEntrySchema]
    created_at: datetime
    updated_at: datetime

class ContainerCreateSchema(Schema):
    """Schema for container creation response"""
    container_id: str
    overall_status: str
    message: str

class ContainerListSchema(Schema):
    """Schema for listing containers"""
    containers: List[ContainerSchema]
    count: int

class ValidationRequestSchema(Schema):
    """Schema for document validation request"""
    container_id: str
    force_revalidate: bool = False

class ValidationResponseSchema(Schema):
    """Schema for validation response"""
    container_id: str
    is_valid: bool
    errors: List[str]
    message: str

class CustomsPaymentRequestSchema(Schema):
    """Schema for customs payment"""
    container_id: str
    amount: Decimal
    payment_reference: Optional[str] = None

class CustomsPaymentResponseSchema(Schema):
    """Schema for customs payment response"""
    container_id: str
    status: str
    amount_paid: Decimal
    payment_date: datetime
    message: str

class CustomsStatusResponseSchema(Schema):
    """Schema for customs status check"""
    container_id: str
    customs_status: str
    amount_due: Optional[Decimal] = None
    message: str

class ShippingStatusResponseSchema(Schema):
    """Schema for shipping status"""
    container_id: str
    shipping_status: str
    vessel_name: Optional[str] = None
    port_of_discharge: Optional[str] = None
    message: str

class InspectionScheduleRequestSchema(Schema):
    """Schema for scheduling inspection"""
    container_id: str
    preferred_date: Optional[str] = None

class InspectionScheduleResponseSchema(Schema):
    """Schema for inspection scheduling response"""
    container_id: str
    inspection_status: str
    scheduled_date: Optional[str] = None
    message: str

class ErrorSchema(Schema):
    """Standard error response schema"""
    error: str
    details: Optional[str] = None

class SuccessSchema(Schema):
    """Generic success response"""
    message: str
    data: Optional[dict] = None
