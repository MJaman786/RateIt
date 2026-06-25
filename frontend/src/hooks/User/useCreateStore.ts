import { useMutation } from "@tanstack/react-query";
import { ADMIN_STORES } from "../../constants/urls";
import makeRequest from "../../utils/helpers/MakeRequest";
import type { Store } from "../../types/Store";

type Payload = {
    name: string;
    email: string;
    address: string;
    ownerId: string;
};

interface Prop {
    payload: Payload;
}

const createStore = async ({ payload }: Prop) => {
    const res = await makeRequest<Store>({
        pathname: ADMIN_STORES,
        method: "POST",
        showMessage: true,
        values: { ...payload },
    });
    return res;
};

export default function useCreateStore() {
    return useMutation({
        mutationFn: createStore,
    });
}