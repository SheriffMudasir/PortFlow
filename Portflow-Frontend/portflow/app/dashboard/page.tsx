"use client";

import { useContainers } from "@/hooks/useContainers";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Plus, Package, Clock, CheckCircle2, Anchor, ArrowLeft } from "lucide-react";

export default function DashboardPage() {
    const { containers, isLoading, error } = useContainers();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                <div className="container mx-auto py-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading containers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                <div className="container mx-auto py-20 text-center">
                    <div className="p-4 bg-red-100 rounded-full inline-flex mb-4">
                        <Package className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-red-500 text-lg">Error loading containers: {error.message}</p>
                    <Link href="/" className="inline-block mt-4">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const stats = {
        total: containers?.length || 0,
        inProgress: containers?.filter(c => c.overall_status !== "RELEASED").length || 0,
        released: containers?.filter(c => c.overall_status === "RELEASED").length || 0,
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            <div className="container mx-auto py-10 px-4">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Anchor className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-4xl font-bold">Container Dashboard</h1>
                        </div>
                        <p className="text-muted-foreground text-lg">Monitor and manage your cargo clearances</p>
                    </div>
                    <Link href="/upload">
                        <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                            <Plus className="w-5 h-5 mr-2" /> New Clearance
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Containers</p>
                                <p className="text-3xl font-bold text-primary">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Package className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <Clock className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Released</p>
                                <p className="text-3xl font-bold text-green-600">{stats.released}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Container List */}
                {!containers || containers.length === 0 ? (
                    <Card className="p-16 text-center border-2 border-dashed">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-slate-100 rounded-2xl">
                                <Package className="w-12 h-12 text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">No containers found</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    Upload a Bill of Lading to start tracking your first container and begin the clearance process.
                                </p>
                            </div>
                            <Link href="/upload">
                                <Button size="lg">
                                    <Plus className="w-5 h-5 mr-2" /> Upload Bill of Lading
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Your Containers</h2>
                            <p className="text-sm text-muted-foreground">
                                {containers.length} {containers.length === 1 ? "container" : "containers"}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {containers.map((container) => (
                                <Card 
                                    key={container.container_id} 
                                    className="p-6 hover:shadow-xl transition-all border-2 hover:border-primary/50 group"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                    <Package className="w-5 h-5 text-primary" />
                                                </div>
                                                <h2 className="text-xl font-semibold">
                                                    {container.container_id}
                                                </h2>
                                                <StatusBadge status={container.overall_status} />
                                            </div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                Updated {formatDistanceToNow(new Date(container.updated_at))} ago
                                            </p>
                                        </div>

                                        <Link href={`/containers/${container.container_id}`} className="w-full md:w-auto">
                                            <Button className="w-full md:w-auto">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                                        <div className="flex items-center justify-between sm:block">
                                            <span className="text-sm text-muted-foreground block mb-2">Customs</span>
                                            <StatusBadge status={container.customs_status} size="sm" />
                                        </div>
                                        <div className="flex items-center justify-between sm:block">
                                            <span className="text-sm text-muted-foreground block mb-2">Shipping</span>
                                            <StatusBadge status={container.shipping_status} size="sm" />
                                        </div>
                                        <div className="flex items-center justify-between sm:block">
                                            <span className="text-sm text-muted-foreground block mb-2">Inspection</span>
                                            <StatusBadge status={container.inspection_status} size="sm" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
