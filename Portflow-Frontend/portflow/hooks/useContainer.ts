import useSWR from "swr";
import { api } from "@/lib/api";
import { Container } from "@/lib/types";

const POLL_INTERVAL = 5000; // 5 seconds

export function useContainer(containerId: string) {
    const { data, error, mutate } = useSWR<Container>(
        containerId ? `/containers/${containerId}` : null,
        () => api.getContainer(containerId),
        {
            refreshInterval: (data) => {
                // Stop polling when container is released
                if (data?.overall_status === "RELEASED") {
                    return 0;
                }
                return POLL_INTERVAL;
            },
            revalidateOnFocus: true,
        }
    );

    return {
        container: data,
        isLoading: !error && !data,
        error,
        mutate,
    };
}
