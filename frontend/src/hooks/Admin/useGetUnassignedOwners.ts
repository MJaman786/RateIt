import { useQuery } from "@tanstack/react-query";
import { ADMIN_UNASSIGNED_OWNERS } from "../../constants/urls";
import makeRequest from "../../utils/helpers/MakeRequest";

interface DropdownOption {
    label: string;
    value: string;
}

const getUnassignedOwners = async () => {
    const res = await makeRequest<DropdownOption[]>({
        pathname: ADMIN_UNASSIGNED_OWNERS,
        method: "GET",
    });
    return res;
};

export default function useGetUnassignedOwners(enabled: boolean) {
    return useQuery({
        queryKey: ["admin-unassigned-owners"],
        queryFn: getUnassignedOwners,
        enabled: enabled,
    });
}