"use client";

/**
 * IBM watsonx Chat Widget Integration
 * Updated: Nov 23, 2025
 * 
 * This component dynamically loads the watsonx chat widget with:
 * - Configuration fetched from backend API
 * - JWT token authentication with auto-refresh
 * - Proper cleanup and error handling
 * 
 * Backend endpoints:
 * - GET /api/watsonx/config - Widget configuration
 * - GET /api/watsonx/token - JWT authentication token
 */

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

declare global {
    interface Window {
        wxOConfiguration?: {
            orchestrationID: string;
            hostURL: string;
            chatOptions: {
                agentId: string;
                token?: string;
            };
            authToken?: string;
            getAuthToken?: () => Promise<string>;
        };
        wxoLoader?: {
            init: () => void;
        };
        __wxoCleanup?: () => void;
    }
}

export function ChatWidget() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error("[ChatWidget] NEXT_PUBLIC_API_URL is not defined");
            setError("Missing API configuration");
            setShowLoading(false);
            return;
        }

        const configUrl = `${apiUrl}/api/watsonx/config`;
        const tokenUrl = `${apiUrl}/api/watsonx/token`;
        let scriptElement: HTMLScriptElement | null = null;
        let cancelled = false;

        const fetchToken = async (): Promise<{ token: string; session_id: string }> => {
            const response = await fetch(tokenUrl, {
                headers: { "ngrok-skip-browser-warning": "true" },
            });

            if (!response.ok) {
                throw new Error(`[ChatWidget] Token request failed: ${response.status}`);
            }

            return response.json();
        };

        const loadWidget = async () => {
            try {
                console.log("[ChatWidget] Loading configuration and token...");
                
                const [configResponse, tokenData] = await Promise.all([
                    fetch(configUrl, { headers: { "ngrok-skip-browser-warning": "true" } }),
                    fetchToken()
                ]);

                if (!configResponse.ok) {
                    throw new Error(`[ChatWidget] Config request failed: ${configResponse.status}`);
                }


                const config = await configResponse.json();
                
                if (cancelled) return;

                console.log("[ChatWidget] Config loaded. Token session:", tokenData.session_id);

                // Define event handler for token refresh (legacy/fallback support)
                const tokenRefreshHandler = async (event: Event) => {
                    console.log("[ChatWidget] authTokenNeeded event fired");
                    try {
                        const newData = await fetchToken();
                        console.log("[ChatWidget] Token refreshed via event handler");
                        
                        
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (event as any).authToken = newData.token;
                        

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if ((event as any).detail) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (event as any).detail.authToken = newData.token;
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (event as any).detail.token = newData.token;
                        }
                        
                        // Update global config
                        if (window.wxOConfiguration) {
                            window.wxOConfiguration.authToken = newData.token;
                            if (window.wxOConfiguration.chatOptions) {
                                window.wxOConfiguration.chatOptions.token = newData.token;
                            }
                        }
                    } catch (e) {
                        console.error("[ChatWidget] Failed to refresh token in event handler", e);
                    }
                };

                // Attach listeners
                window.addEventListener('authTokenNeeded', tokenRefreshHandler);
                document.addEventListener('authTokenNeeded', tokenRefreshHandler);

                window.wxOConfiguration = {
                    orchestrationID: config.orchestrationID,
                    hostURL: config.hostURL,
                    chatOptions: {
                        agentId: config.chatOptions?.agentId,
                        token: tokenData.token,
                    },
                    authToken: tokenData.token,
                    getAuthToken: async () => {
                        console.log("[ChatWidget] getAuthToken invoked for refresh");
                        const newData = await fetchToken();
                        return newData.token;
                    }
                };

                console.log("[ChatWidget] wxOConfiguration hydrated with initial token");

                const script = document.createElement("script");
                script.src = `${config.hostURL}/wxochat/wxoLoader.js?embed=script_addon`;
                script.async = true;
                scriptElement = script;

                script.addEventListener("load", () => {
                    const wxoLoader = window.wxoLoader;
                    if (!wxoLoader) {
                        console.error("[ChatWidget] wxoLoader missing on window");
                        setError("Widget loader unavailable");
                        setShowLoading(false);
                        return;
                    }

                    wxoLoader.init();
                    console.log("[ChatWidget] Widget initialized successfully");
                    setIsLoaded(true);
                    setShowLoading(false);
                });

                // Cleanup function to remove listeners
                const cleanupListeners = () => {
                    window.removeEventListener('authTokenNeeded', tokenRefreshHandler);
                    document.removeEventListener('authTokenNeeded', tokenRefreshHandler);
                };
                
                // Store cleanup for useEffect return
                window.__wxoCleanup = cleanupListeners;

                script.addEventListener("error", (event) => {
                    console.error("[ChatWidget] Widget script failed to load", event);
                    setError("Failed to load chat widget script");
                    setShowLoading(false);
                });

                document.head.appendChild(script);
                console.log("[ChatWidget] Widget script appended to document head");
            } catch (loadError) {
                if (cancelled) {
                    return;
                }
                console.error("[ChatWidget] Error initializing widget", loadError);
                setError(loadError instanceof Error ? loadError.message : "Unknown error");
                setShowLoading(false);
            }
        };

        const timer = setTimeout(loadWidget, 500);

        return () => {
            cancelled = true;
            clearTimeout(timer);
            if (scriptElement?.parentNode) {
                scriptElement.parentNode.removeChild(scriptElement);
            }
            if (window.wxOConfiguration) {
                delete window.wxOConfiguration;
            }
            // Execute cleanup if it exists
            if (window.__wxoCleanup) {
                window.__wxoCleanup();
                delete window.__wxoCleanup;
            }
        };
    }, []);

    const widgetRoot = <div id="root"></div>;

    if (showLoading && !isLoaded && !error) {
        return (
            <>
                {widgetRoot}
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="bg-primary text-white rounded-full p-4 shadow-2xl animate-pulse flex items-center gap-3">
                        <MessageCircle className="w-6 h-6" />
                        <span className="font-medium">Loading PortFlow Agent...</span>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                {widgetRoot}
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="bg-red-500 text-white rounded-lg p-4 shadow-2xl max-w-xs">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-semibold">Chat Unavailable</span>
                        </div>
                        <p className="text-sm opacity-90 mb-3">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-sm bg-white text-red-500 px-4 py-1.5 rounded hover:bg-red-50 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return widgetRoot;
}
