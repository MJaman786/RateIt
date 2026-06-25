import { useMutation } from "@tanstack/react-query"
import { VERIFY_OTP } from "../../constants/urls"
import makeRequest from "../../utils/helpers/MakeRequest"
import type { User } from "../../types/Auth"

type payload = {
    userId: string,
    type: string,
    otp: string
}

interface Prop {
    payload: payload
}

interface ApiResponse {
    verified: boolean,
    type: string,
    accessToken: string,
    user:User
}

const verifyOtp = async ({ payload }: Prop) => {
    const res = await makeRequest<ApiResponse>({
        pathname: VERIFY_OTP,
        method: 'POST',
        showMessage: true,
        token: false,
        values: { ...payload }
    })
    return res;
}

export default function useVerifyOtp() {
    return useMutation({
        mutationFn: verifyOtp
    })
}