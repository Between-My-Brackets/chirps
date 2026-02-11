import {CustomError} from "./customErrors.js";

export class UnauthorizedError extends CustomError{
    statusCode = 401;

    constructor(message?: string) {
        super("Unauthorized");
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }

    serializeErrors() {
        return [
            {
                message: "Unauthorized"
            }
        ]
    }
}