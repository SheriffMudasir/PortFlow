import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
    // Overall Status
    PENDING_VALIDATION: { label: "Pending Validation", color: "bg-yellow-500" },
    VALIDATED: { label: "Validated", color: "bg-blue-500" },
    CUSTOMS_CLEARED: { label: "Customs Cleared", color: "bg-green-500" },
    PENDING_INSPECTION: { label: "Pending Inspection", color: "bg-orange-500" },
    INSPECTION_PASSED: { label: "Inspection Passed", color: "bg-green-500" },
    INSPECTION_FAILED: { label: "Inspection Failed", color: "bg-red-500" },
    RELEASED: { label: "Released", color: "bg-emerald-500" },

    // Customs Status
    NOT_STARTED: { label: "Not Started", color: "bg-gray-500" },
    PENDING_PAYMENT: { label: "Pending Payment", color: "bg-yellow-500" },
    PAID: { label: "Paid", color: "bg-green-500" },

    // Shipping Status
    IN_TRANSIT: { label: "In Transit", color: "bg-blue-500" },
    ARRIVED: { label: "Arrived", color: "bg-green-500" },
    READY_FOR_PICKUP: { label: "Ready for Pickup", color: "bg-emerald-500" },

    // Inspection Status
    SCHEDULED: { label: "Scheduled", color: "bg-blue-500" },
    IN_PROGRESS: { label: "In Progress", color: "bg-orange-500" },
    PASSED: { label: "Passed", color: "bg-green-500" },
    FAILED: { label: "Failed", color: "bg-red-500" },
};

interface StatusBadgeProps {
    status: string;
    size?: "sm" | "default";
    className?: string;
}

export function StatusBadge({
    status,
    size = "default",
    className,
}: StatusBadgeProps) {
    const config = statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        color: "bg-gray-500",
    };

    return (
        <Badge
            className={cn(
                config.color,
                "text-white hover:bg-opacity-80",
                size === "sm" && "text-xs px-2 py-0.5",
                className
            )}
        >
            {config.label}
        </Badge>
    );
}
