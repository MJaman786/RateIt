import { useQuery } from "@tanstack/react-query";
import { ADMIN_DASHBOARD_STATS } from "../../constants/urls";
import makeRequest from "../../utils/helpers/MakeRequest";

export interface AdminDashboardStatsData {
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
}

const getAdminStats = async () => {
    const res = await makeRequest<AdminDashboardStatsData>({
        pathname: ADMIN_DASHBOARD_STATS,
        method: "GET",
    });
    return res;
};

export default function useGetAdminStats() {
    return useQuery({
        queryKey: ["admin-dashboard-stats"],
        queryFn: getAdminStats,
    });
}