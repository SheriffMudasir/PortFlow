import { Container } from "@/lib/types";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface TimelineProps {
    container: Container;
}

const steps = [
    {
        id: "upload",
        label: "Document Uploaded",
        status: "overall_status",
        value: "PENDING_VALIDATION",
    },
    {
        id: "validated",
        label: "Validated",
        status: "overall_status",
        value: "VALIDATED",
    },
    {
        id: "customs",
        label: "Customs Cleared",
        status: "customs_status",
        value: "PAID",
    },
    {
        id: "inspection",
        label: "Inspection Passed",
        status: "inspection_status",
        value: "PASSED",
    },
    {
        id: "released",
        label: "Released",
        status: "overall_status",
        value: "RELEASED",
    },
];

export function Timeline({ container }: TimelineProps) {
    const getStepStatus = (step: (typeof steps)[0]): "completed" | "current" | "pending" => {
        // Special case for upload - always completed if we have a container
        if (step.id === "upload") return "completed";

        const statusValue = container[step.status as keyof Container];

        // If the specific status matches the target value, it's completed
        if (statusValue === step.value) return "completed";

        // Check if we're past this step based on the sequence
        const currentOverallStatus = container.overall_status;
        const currentStepIndex = steps.findIndex(s => s.value === currentOverallStatus);
        const stepIndex = steps.findIndex(s => s.id === step.id);

        if (currentStepIndex > stepIndex) return "completed";
        if (currentStepIndex === stepIndex) return "current";

        return "pending";
    };

    return (
        <div className="space-y-4">
            {steps.map((step, index) => {
                const status = getStepStatus(step);

                return (
                    <div key={step.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            {status === "completed" && (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            )}
                            {status === "current" && (
                                <Clock className="w-6 h-6 text-blue-500 animate-pulse" />
                            )}
                            {status === "pending" && (
                                <Circle className="w-6 h-6 text-gray-300" />
                            )}

                            {index < steps.length - 1 && (
                                <div
                                    className={`w-0.5 h-8 ${status === "completed" ? "bg-green-500" : "bg-gray-300"
                                        }`}
                                />
                            )}
                        </div>

                        <div>
                            <p
                                className={`font-medium ${status === "completed"
                                        ? "text-green-700"
                                        : status === "current"
                                            ? "text-blue-700"
                                            : "text-gray-400"
                                    }`}
                            >
                                {step.label}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
