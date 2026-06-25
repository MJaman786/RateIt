import { useMutation } from "@tanstack/react-query";
import { LOGIN } from "../../constants/urls"
import makeRequest from "../../utils/helpers/MakeRequest"
import type { AuthResponse } from "../../types/Auth";

interface Prop {
    email: string,
    password: string
}

const login = async ({ email, password }: Prop) => {
    const res = await makeRequest<AuthResponse>({
        method: 'POST',
        pathname: LOGIN,
        values: { email, password },
        showMessage: true,
        token: false,
    });
    return res;
}

export default function useLogin() {
    return useMutation({
        mutationFn: login
    })
}

