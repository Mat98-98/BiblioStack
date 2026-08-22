import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "./appError.js";

export const assertNotSuspended = async (userId) => {
    const suspension = await userRepository.findActiveSuspension(userId);
    if (suspension) {
        throw new AppError(
            "User is suspended and cannot perform this action",
            "USER_SUSPENDED",
            403
        );
    }
};