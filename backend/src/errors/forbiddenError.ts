import  {CustomError} from "./customErrors.js";

export class ForbiddenError extends CustomError {
    statusCode = 403;

    constructor() {
        super("Forbidden");
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }

    serializeErrors(){
        return [
            {
                message: "Forbidden"
            }
        ]
    }
}