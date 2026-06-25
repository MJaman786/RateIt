import { useQuery } from "@tanstack/react-query";
import { ADMIN_USERS } from "../../constants/urls";
import makeRequest from "../../utils/helpers/MakeRequest";

interface Prop {
    search: string;
    role?: string;
    order: string;
    sortBy: string;
}

const getAllUsers = async ({ search, role, order, sortBy }: Prop) => {
    const res = await makeRequest<any[]>({
        pathname: ADMIN_USERS,
        method: "GET",
        params: {
            search: search || undefined,
            role: role || undefined,
            order: order || undefined,
            sortBy: sortBy || undefined,
        },
    });
    return res;
};

export default function useGetAllUsers({ search, role, order, sortBy }: Prop) {
    return useQuery({
        queryKey: ["get-users", search, role, order, sortBy],
        queryFn: () => getAllUsers({ search, role, order, sortBy }),
    });
}