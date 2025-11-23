"use client";
// We added the demo controls component to help with testing in demo mode
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { CheckCircle2, Package } from "lucide-react";
import { useState } from "react";

interface DemoControlsProps {
    containerId: string;
    onUpdate?: () => void;
}

export function DemoControls({ containerId, onUpdate }: DemoControlsProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
        return null;
    }

    const handleCompleteInspection = async () => {
        setIsProcessing(true);
        try {
            await api.completeInspection(containerId, true);
            toast.success("Inspection marked as passed");
            if (onUpdate) onUpdate();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            toast.error("Error", {
                description: message,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRelease = async () => {
        setIsProcessing(true);
        try {
            await api.releaseContainer(containerId);
            toast.success("Container released!");
            if (onUpdate) onUpdate();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            toast.error("Error", {
                description: message,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card className="p-4 bg-linear-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-yellow-200 rounded-full">
                    <Package className="w-4 h-4 text-yellow-700" />
                </div>
                <h3 className="font-semibold text-yellow-900">Demo Controls</h3>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
                Simulate inspection completion and container release
            </p>
            <div className="flex gap-2 flex-wrap">
                <Button 
                    onClick={handleCompleteInspection} 
                    variant="outline" 
                    size="sm"
                    disabled={isProcessing}
                    className="border-yellow-300 hover:bg-yellow-100"
                >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Complete Inspection
                </Button>
                <Button 
                    onClick={handleRelease} 
                    variant="outline" 
                    size="sm"
                    disabled={isProcessing}
                    className="border-yellow-300 hover:bg-yellow-100"
                >
                    <Package className="w-4 h-4 mr-1.5" />
                    Release Container
                </Button>
            </div>
        </Card>
    );
}
