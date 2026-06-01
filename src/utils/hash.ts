import bcrypt from "bcrypt";

export const bcryptHelper = {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    },

    async comparePasswords(
        password: string,
        passwordHash: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, passwordHash);
    },
};
