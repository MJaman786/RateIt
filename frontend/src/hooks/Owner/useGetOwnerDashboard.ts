import { useQuery } from "@tanstack/react-query";
import { OWNER_DASHBOARD } from "../../constants/urls";
import makeRequest from "../../utils/helpers/MakeRequest";

export interface OwnerStoreMetrics {
    storeName: string;
    averageRating: number;
    totalRatings: number;
    recentActivityCount: number;
}

const getOwnerDashboard = async () => {
    const res = await makeRequest<OwnerStoreMetrics>({
        pathname: OWNER_DASHBOARD,
        method: "GET",
    });
    return res;
};

export default function useGetOwnerDashboard() {
    return useQuery({
        queryKey: ["owner-dashboard-metrics"],
        queryFn: getOwnerDashboard,
    });
}