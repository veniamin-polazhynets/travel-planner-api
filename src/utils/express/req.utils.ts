import { Request } from "express";
import { JWTPayload } from "../../types/jwt";
import { UnauthorizedError } from "../../errors/http.errors";

export const getAuthorizedUser = (req: Request): JWTPayload => {
    if (!req.user) {
        throw new UnauthorizedError("User is not authorized");
    }

    return req.user;
};
