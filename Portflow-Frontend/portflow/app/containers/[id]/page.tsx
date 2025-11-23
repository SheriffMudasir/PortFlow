"use client";

import { useContainer } from "@/hooks/useContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Timeline } from "@/components/Timeline";
import { AuditLog } from "@/components/AuditLog";
import { DemoControls } from "@/components/DemoControls";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CreditCard, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ContainerDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { container, isLoading, error, mutate } = useContainer(id);

    const handlePayCustoms = async () => {
        if (!container?.customs_duty_amount) return;

        try {
            await api.payCustomsDuty(
                container.container_id,
                container.customs_duty_amount
            );

            toast.success("Payment Successful", {
                description: `₦${container.customs_duty_amount} paid.`,
            });

            mutate(); // Refresh data
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            toast.error("Payment Failed", {
                description: message,
            });
        }
    };

    const handleScheduleInspection = async () => {
        if (!container) return;

        try {
            // Schedule for tomorrow by default for demo
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dateStr = tomorrow.toISOString().split('T')[0];

            await api.scheduleInspection(container.container_id, dateStr);

            toast.success("Inspection Scheduled", {
                description: `Inspection scheduled for ${dateStr}.`,
            });

            mutate();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            toast.error("Scheduling Failed", {
                description: message,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 text-center">
                <p className="text-red-500 mb-4">Error: {error.message}</p>
                <Link href="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    if (!container) return <div className="container mx-auto py-10 text-center">Container not found</div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{container.container_id}</h1>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-muted-foreground">Status:</span>
                        <StatusBadge status={container.overall_status} />
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {container.customs_status === "PENDING_PAYMENT" && (
                        <Button onClick={handlePayCustoms} className="bg-green-600 hover:bg-green-700">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay ₦{container.customs_duty_amount}
                        </Button>
                    )}

                    {container.overall_status === "CUSTOMS_CLEARED" && container.inspection_status === "NOT_STARTED" && (
                        <Button onClick={handleScheduleInspection}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Inspection
                        </Button>
                    )}
                </div>
            </div>

            {/* Demo Controls */}
            <div className="mb-6">
                <DemoControls containerId={container.container_id} onUpdate={mutate} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Container Info */}
                <Card className="p-6 lg:col-span-2 h-fit">
                    <h2 className="text-xl font-semibold mb-6">Container Information</h2>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        <div>
                            <dt className="text-sm text-muted-foreground">Vessel</dt>
                            <dd className="font-medium text-lg">{container.vessel_name || "N/A"}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Importer</dt>
                            <dd className="font-medium text-lg">
                                {container.importer_name || "N/A"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Port of Loading</dt>
                            <dd className="font-medium text-lg">
                                {container.port_of_loading || "N/A"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Port of Discharge</dt>
                            <dd className="font-medium text-lg">
                                {container.port_of_discharge || "N/A"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Cargo Description</dt>
                            <dd className="font-medium text-lg">
                                {container.cargo_description || "N/A"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-muted-foreground">Cargo Weight</dt>
                            <dd className="font-medium text-lg">
                                {container.cargo_weight || "N/A"} kg
                            </dd>
                        </div>
                    </dl>

                    {/* Status Grid */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                        <div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-900">
                            <p className="text-sm text-muted-foreground mb-2">Customs</p>
                            <StatusBadge status={container.customs_status} />
                            {container.customs_duty_amount && (
                                <p className="text-sm mt-2 font-mono">₦{container.customs_duty_amount}</p>
                            )}
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-900">
                            <p className="text-sm text-muted-foreground mb-2">Shipping</p>
                            <StatusBadge status={container.shipping_status} />
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-900">
                            <p className="text-sm text-muted-foreground mb-2">Inspection</p>
                            <StatusBadge status={container.inspection_status} />
                        </div>
                    </div>
                </Card>

                {/* Right Column - Timeline */}
                <Card className="p-6 h-fit">
                    <h2 className="text-xl font-semibold mb-6">Progress Timeline</h2>
                    <Timeline container={container} />
                </Card>
            </div>

            {/* Audit Log */}
            <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-6">Audit Log</h2>
                <AuditLog logs={container.logs} />
            </Card>
        </div>
    );
}
