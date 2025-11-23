"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { UploadCloud, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
            } else {
                toast.error("Invalid File", {
                    description: "Please upload a PDF file only.",
                });
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await api.uploadBillOfLading(file);

            toast.success("Success!", {
                description: `Container ${result.container_id} created successfully.`,
            });

            // Redirect to container detail page
            router.push(`/containers/${result.container_id}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            toast.error("Upload Failed", {
                description: message,
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            <div className="container mx-auto py-10 px-4">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                </Link>

                <Card className="max-w-3xl mx-auto p-8 md:p-12 shadow-xl border-2">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
                            <UploadCloud className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Upload Bill of Lading</h1>
                        <p className="text-muted-foreground text-lg">
                            Upload your Bill of Lading (PDF) to start the automated clearance process
                        </p>
                    </div>

                    <div 
                        className={`border-2 border-dashed rounded-2xl p-12 md:p-16 text-center transition-all cursor-pointer relative
                            ${dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-slate-300 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900"}
                            ${file ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""}
                        `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id="file-upload"
                        />
                        <div className="flex flex-col items-center gap-4">
                            {file ? (
                                <>
                                    <div className="p-4 bg-green-100 rounded-2xl text-green-600">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xl mb-1">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        className="mt-2"
                                    >
                                        Remove File
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="p-4 bg-slate-100 rounded-2xl text-slate-600 dark:bg-slate-800">
                                        <FileText className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xl mb-1">
                                            {dragActive ? "Drop your file here" : "Click to upload or drag and drop"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            PDF files only (max 10MB)
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className="w-full mt-8 h-14 text-lg shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-5 h-5 mr-2" />
                                Upload & Start Clearance
                            </>
                        )}
                    </Button>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
                        <h3 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-300">What happens next?</h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1.5">
                            <li className="flex items-start">
                                <span className="mr-2">1.</span>
                                <span>Your document is securely uploaded and parsed using AI</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">2.</span>
                                <span>Container information is validated against customs requirements</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">3.</span>
                                <span>Automated clearance process begins with real-time tracking</span>
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    );
}
