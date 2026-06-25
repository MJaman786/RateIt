import type { User } from "../Auth";

export interface Ratings {
    ratingId: string,
    rating: number,
    createdAt: string,
    user: User
}