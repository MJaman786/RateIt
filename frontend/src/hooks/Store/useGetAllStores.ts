import { useQuery } from "@tanstack/react-query"
import { ADMIN_STORES } from "../../constants/urls"
import makeRequest from "../../utils/helpers/MakeRequest"
import type { Store } from "../../types/Store"

interface Prop {
    search: string,
    order: string,
    sortBy: string
}

const getAllStores = async ({ search, order, sortBy }: Prop) => {
    const res = makeRequest<Store[]>({
        pathname: ADMIN_STORES,
        method: 'GET',
        params: {
            search: search || undefined,
            order: order || undefined,
            sortBy: sortBy || undefined,
        }
    })
    return res;
}

export default function useGetAllStores({ search, order, sortBy }: Prop) {
    return useQuery({
        queryKey: ['get-stores', search, order, sortBy],
        queryFn: () => getAllStores({ search, order, sortBy })
    })
}