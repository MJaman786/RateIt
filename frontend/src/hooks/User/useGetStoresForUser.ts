import { useQuery } from "@tanstack/react-query";
import { USER_STORES } from "../../constants/urls";
import makeRequest from "../../utils/helpers/MakeRequest";

interface Prop {
    search: string;
    sortBy: string;
    order: string;
}

const getStoresForUser = async ({ search, sortBy, order }: Prop) => {
    const res = await makeRequest<any[]>({
        pathname: USER_STORES,
        method: "GET",
        params: {
            search: search || undefined,
            sortBy: sortBy || undefined,
            order: order || undefined,
        },
    });
    return res;
};

export default function useGetStoresForUser({ search, sortBy, order }: Prop) {
    return useQuery({
        queryKey: ["user-stores", search, sortBy, order],
        queryFn: () => getStoresForUser({ search, sortBy, order }),
    });
}