import { LogEntry } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Activity, User } from "lucide-react";

interface AuditLogProps {
    logs: LogEntry[];
}

export function AuditLog({ logs }: AuditLogProps) {
    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No activity logs available</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {logs.map((log, index) => (
                <div 
                    key={index} 
                    className="relative pl-8 pb-6 border-l-2 border-slate-200 dark:border-slate-700 last:pb-0 last:border-l-0 hover:border-primary/50 transition-colors group"
                >
                    {/* Timeline dot */}
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background group-hover:scale-110 transition-transform" />
                    
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <span className="font-semibold text-base">{log.action}</span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                {formatDistanceToNow(new Date(log.timestamp), {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                        
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
                            {log.details}
                        </p>
                        
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>By: {log.actor}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
