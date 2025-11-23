import useSWR from "swr";
import { api } from "@/lib/api";
import { ContainerListResponse } from "@/lib/types";

export function useContainers(status?: string) {
    const { data, error, mutate } = useSWR<ContainerListResponse>(
        "/containers",
        () => api.listContainers({ status }),
        {
            refreshInterval: 10000, 
            revalidateOnFocus: true,
        }
    );

    return {
        containers: data?.containers,
        count: data?.count,
        isLoading: !error && !data,
        error,
        mutate,
    };
}
