import { useMutation } from "@tanstack/react-query"
import { SEND_OTP } from "../../constants/urls"
import makeRequest from "../../utils/helpers/MakeRequest"

type Payload = {
    userId: string,
    type: string
}

interface Prop {
    payload: Payload
}

const sendOtp = async ({ payload }: Prop) => {
    const res = makeRequest({
        pathname: SEND_OTP,
        method: 'POST',
        showMessage: true,
        values: { ...payload },
        token: false
    })
    return res;
}

export default function useSendOtp() {
    return useMutation({
        mutationFn: sendOtp
    })
}