import { useMutation } from "@tanstack/react-query";
import { ADMIN_USERS } from "../../constants/urls";
import makeRequest from "../../utils/helpers/MakeRequest";

type UserPayload = {
    name: string;
    email: string;
    // phone: string;
    role: string;
    password?: string;
    address: string;
};

interface Prop {
    payload: UserPayload;
}

const createUser = async ({ payload }: Prop) => {
    const res = await makeRequest<any>({
        pathname: ADMIN_USERS,
        method: "POST",
        showMessage: true,
        values: { ...payload },
    });
    return res;
};

export default function useCreateUser() {
    return useMutation({
        mutationFn: createUser,
    });
}