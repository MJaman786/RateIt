import { useQuery } from "@tanstack/react-query";
import makeRequest from "../../utils/helpers/MakeRequest";
import type { Ratings } from "../../types/Rating";

interface Prop {
    search: string,
    rating: string,
    sortBy: string,
    order: string,
    page: number,
    limit: number,
}

const getOwnerRatings = async ({ search, sortBy, limit, page, rating, order }: Prop) => {
    const res = await makeRequest<Ratings[]>({
        pathname: "/owner/ratings",
        method: "GET",
        params: {
            search: search || undefined,
            rating: rating || undefined,
            sortBy: sortBy || undefined,
            order: order || undefined,
            page:page || undefined,
            limit:limit || undefined
        },
    });
    return res;
};

export default function useGetOwnerRatings({ search, sortBy, limit, page, rating, order }: Prop) {
    return useQuery({
        queryKey: ["owner-store-ratings", search, sortBy, limit, page, rating, order],
        queryFn: () => getOwnerRatings({ search, sortBy, limit, page, rating, order }),
    });
}
