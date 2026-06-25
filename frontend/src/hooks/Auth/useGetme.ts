import { useQuery } from "@tanstack/react-query";
import { GET_ME } from "../../constants/urls"
import makeRequest from "../../utils/helpers/MakeRequest"
import type { User } from "../../types/Auth";

const getMe = async () => {
    const res = await makeRequest<User>({
        pathname: GET_ME,
        method: 'GET',
    })
    return res;
}

export default function useGetMe() {
    return useQuery({
        queryKey: ['get-me'],
        queryFn: getMe
    })
}