import jsonwebtoken from "jsonwebtoken";
import { JWTPayload } from "../types/jwt";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/config";

export const jwtHelper = {
    createRefreshToken(payload: JWTPayload) {
        return jsonwebtoken.sign(payload, REFRESH_TOKEN_SECRET, {
            expiresIn: "7d",
        });
    },

    createAccessToken(payload: JWTPayload) {
        return jsonwebtoken.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: "5m",
        });
    },

    verifyRefreshToken(refreshToken: string): JWTPayload {
        const decoded = jsonwebtoken.verify(
            refreshToken,
            REFRESH_TOKEN_SECRET,
        ) as jsonwebtoken.JwtPayload;

        return {
            userId: decoded.userId,
            tokenVersion: decoded.tokenVersion,
        };
    },

    verifyAccessToken(accessToken: string): JWTPayload {
        const decoded = jsonwebtoken.verify(
            accessToken,
            ACCESS_TOKEN_SECRET,
        ) as jsonwebtoken.JwtPayload;

        return {
            userId: decoded.userId,
            tokenVersion: decoded.tokenVersion,
        };
    },
};
