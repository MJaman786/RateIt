import { useQuery } from "@tanstack/react-query";
import { ADMIN_RATINGS } from "../../constants/urls";
import makeRequest from "../../utils/helpers/MakeRequest";

interface Prop {
    search: string;
    scoreFilter: string;
    sortBy: string;
    order: string;
}

const getAdminRatings = async ({ search, scoreFilter, sortBy, order }: Prop) => {
    const res = await makeRequest<any[]>({
        pathname: ADMIN_RATINGS,
        method: "GET",
        params: { search, scoreFilter, sortBy, order }
    });
    return res;
};

export default function useGetAdminRatings({ search, scoreFilter, sortBy, order }: Prop) {
    return useQuery({
        queryKey: ["admin-global-ratings", search, scoreFilter, sortBy, order],
        queryFn: () => getAdminRatings({ search, scoreFilter, sortBy, order })
    });
}