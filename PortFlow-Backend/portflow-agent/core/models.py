from django.db import models

class Container(models.Model):
    """Cargo container in the clearance workflow.

    Tracks the complete state of the container through validation, customs,
    inspection and final release stages.
    """

    class OverallStatus(models.TextChoices):
        PENDING_VALIDATION = 'PENDING_VALIDATION', 'Pending Validation'
        VALIDATED = 'VALIDATED', 'Validated'
        PENDING_CUSTOMS = 'PENDING_CUSTOMS', 'Pending Customs'
        CUSTOMS_CLEARED = 'CUSTOMS_CLEARED', 'Customs Cleared'
        PENDING_INSPECTION = 'PENDING_INSPECTION', 'Pending Inspection'
        INSPECTION_PASSED = 'INSPECTION_PASSED', 'Inspection Passed'
        RELEASED = 'RELEASED', 'Released'
        FAILED = 'FAILED', 'Failed'
    
    class CustomsStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAYMENT_REQUIRED = 'PAYMENT_REQUIRED', 'Payment Required'
        PAID = 'PAID', 'Paid'
        CLEARED = 'CLEARED', 'Cleared'
        REJECTED = 'REJECTED', 'Rejected'
    
    class ShippingStatus(models.TextChoices):
        IN_TRANSIT = 'IN_TRANSIT', 'In Transit'
        ARRIVED = 'ARRIVED', 'Arrived'
        DISCHARGED = 'DISCHARGED', 'Discharged'
        READY_FOR_PICKUP = 'READY_FOR_PICKUP', 'Ready for Pickup'
    
    class InspectionStatus(models.TextChoices):
        NOT_SCHEDULED = 'NOT_SCHEDULED', 'Not Scheduled'
        SCHEDULED = 'SCHEDULED', 'Scheduled'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        PASSED = 'PASSED', 'Passed'
        FAILED = 'FAILED', 'Failed'
    
    container_id = models.CharField(max_length=20, unique=True, db_index=True)
    overall_status = models.CharField(
        max_length=30,
        choices=OverallStatus.choices,
        default=OverallStatus.PENDING_VALIDATION
    )
    
    vessel_name = models.CharField(max_length=120, null=True, blank=True)
    importer_name = models.CharField(max_length=200, null=True, blank=True)
    importer_address = models.TextField(null=True, blank=True)
    tin = models.CharField(max_length=50, null=True, blank=True, help_text="Tax Identification Number")
    port_of_loading = models.CharField(max_length=100, null=True, blank=True)
    port_of_discharge = models.CharField(max_length=100, null=True, blank=True)
    cargo_description = models.TextField(null=True, blank=True)
    cargo_weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    customs_status = models.CharField(
        max_length=20,
        choices=CustomsStatus.choices,
        default=CustomsStatus.PENDING
    )
    shipping_status = models.CharField(
        max_length=20,
        choices=ShippingStatus.choices,
        default=ShippingStatus.IN_TRANSIT
    )
    inspection_status = models.CharField(
        max_length=20,
        choices=InspectionStatus.choices,
        default=InspectionStatus.NOT_SCHEDULED
    )
    
    customs_duty_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    customs_paid_at = models.DateTimeField(null=True, blank=True)
    
    original_filename = models.CharField(max_length=255, null=True, blank=True)
    document_validated = models.BooleanField(default=False)
    validation_errors = models.JSONField(default=list, blank=True)
    
    logs = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.container_id} - {self.overall_status}"
    
    def add_log(self, actor: str, action: str, details: str):
        """Helper method to add a log entry"""
        from datetime import datetime
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "actor": actor,
            "action": action,
            "details": details
        }
        self.logs.append(log_entry)
        self.save()
