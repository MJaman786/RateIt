import { useQuery } from "@tanstack/react-query";
import { USER_RATINGS_HISTORY } from "../../constants/urls";
import makeRequest from "../../utils/helpers/MakeRequest";

interface Prop {
    search: string;
    sortBy: string;
    order: string;
}

const getUserRatingsHistory = async ({ search, sortBy, order }: Prop) => {
    const res = await makeRequest<any[]>({
        pathname: USER_RATINGS_HISTORY,
        method: "GET",
        params: { search, sortBy, order }
    });
    return res;
};

export default function useGetUserRatingsHistory({ search, sortBy, order }: Prop) {
    return useQuery({
        queryKey: ["user-ratings-history-log", search, sortBy, order],
        queryFn: () => getUserRatingsHistory({ search, sortBy, order })
    });
}