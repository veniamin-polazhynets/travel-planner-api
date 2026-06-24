import { User, UserResponse } from "../../types/user";

export const mapToUserResponse = (user: User): UserResponse => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
    };
};
