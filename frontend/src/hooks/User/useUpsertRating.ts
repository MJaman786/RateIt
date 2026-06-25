import { useMutation } from "@tanstack/react-query";
import { SUBMIT_RATING } from "../../constants/urls";
import makeRequest from "../../utils/helpers/MakeRequest";

type RatingPayload = {
    storeId: string;
    rating: number;
    comment?: string;
};

interface Prop {
    payload: RatingPayload;
}

const upsertRating = async ({ payload }: Prop) => {
    const res = await makeRequest<any>({
        pathname: SUBMIT_RATING,
        method: "POST",
        values: { ...payload },
        showMessage: true,
    });
    return res;
};

export default function useUpsertRating() {
    return useMutation({
        mutationFn: upsertRating,
    });
}