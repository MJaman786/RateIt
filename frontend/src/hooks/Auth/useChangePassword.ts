import { useMutation } from "@tanstack/react-query"
import { CHANGE_PASSWORD } from "../../constants/urls"
import makeRequest from "../../utils/helpers/MakeRequest"

type Payload = {
    userId: string,
    currentPassword: string,
    newPassword: string
}

interface Prop {
    payload: Payload
}

const changePassword = async ({ payload }: Prop) => {
    const res = makeRequest({
        pathname: CHANGE_PASSWORD,
        method: 'PATCH',
        showMessage: true,
        values: { ...payload }
    })
    return res;
}

export default function useChangePassword() {
    return useMutation({
        mutationFn: changePassword
    })
}