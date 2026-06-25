import { useMutation } from "@tanstack/react-query";
import { LOGOUT } from "../../constants/urls"
import makeRequest from "../../utils/helpers/MakeRequest"

const logout = async () => {
    const res = await makeRequest({
        method: 'POST',
        pathname: LOGOUT,
        showMessage: true,
    })

    return res;
}

export default function useLogout() {
    return useMutation({
        mutationFn: logout
    })
}
