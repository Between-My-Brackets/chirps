import {CustomError} from "./customErrors.js";

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor(message?:string) {
        super("Not Found");
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(){
        return [
            {
                message : "Not Found"
            }
        ];
    }
}