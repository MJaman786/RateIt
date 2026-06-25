import { useMutation } from "@tanstack/react-query"
import { SIGNUP } from "../../constants/urls"
import makeRequest from "../../utils/helpers/MakeRequest"
import type { User } from "../../types/Auth"

type payload = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    // phone: string
}

interface Prop {
    payload: payload
}

interface ApiResponse {
    user: User
}

const signup = async ({ payload }: Prop) => {
    const res = await makeRequest<ApiResponse>({
        method: 'POST',
        pathname: SIGNUP,
        token: false,
        values: { ...payload },
        showMessage: true
    })
    return res;
}

export default function useSignUp() {
    return useMutation({
        mutationFn: signup
    })
}