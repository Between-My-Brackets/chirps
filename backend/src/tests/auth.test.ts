import {describe, it, expect, beforeAll} from "vitest";
import {makeJWT, validateJWT, hashPassword, checkPasswordHash, getBearerToken} from "../utils/auth.utils.js";
import {Request} from "express";

describe("Password Hashing", ()=> {
    const password= "correctPassword123!";
    const incorrectPassword = "incorrectpassword";
    let hash: string;

    beforeAll(async () => {
             hash = await hashPassword(password);
           });

       it("should return true for the correct password", async () => {
             const result = await checkPasswordHash(password, hash);
             expect(result).toBe(true);
           });

       it("should return false for an incorrect password", async () => {
             const result = await checkPasswordHash(incorrectPassword, hash);
             expect(result).toBe(false);
           });
     });

describe("JWT Creation and Validation", () => {
    const userID = "test-user-id";
    const secret = "my-super-secret-key";
    const wrongSecret = "my-wrong-secret-key";

    it("should create a token that can be validated", () => {
        const token = makeJWT(userID, 3600, secret); // 1 hour
        const validatedUserID = validateJWT(token, secret);
        expect(validatedUserID).toBe(userID);
    });

    it("should throw an error for a token signed with the wrong secret", () => {
        const token = makeJWT(userID, 3600, secret);
        expect(() => validateJWT(token, wrongSecret)).toThrow("invalid signature");
    });

    it("should throw an error for an expired token", () => {
        const expiredToken = makeJWT(userID, -1, secret); // Expires 1 second in the past
        expect(() => validateJWT(expiredToken, secret)).toThrow("jwt expired");
    });

    it("should throw an error for an invalid token", () => {
        const invalidToken = "this.is.not.a.token";
        expect(() => validateJWT(invalidToken, secret)).toThrow("jwt malformed");
    });
});

describe("Bearer Token Extraction", () => {
   it("should extract the token string from a valid Authorization header", () => {
     const mockRequest = {
       get: (headerName: string) => {
         if (headerName === "Authorization") {
           return "Bearer some.jwt.token";
         }
         return undefined;
       },
     } as Request; // Cast to Request

     const token = getBearerToken(mockRequest);
     expect(token).toBe("some.jwt.token");
   });

   it("should throw an error if Authorization header is missing", () => {
     const mockRequest = {
       get: (headerName: string) => {
         if (headerName === "Authorization") {
           return undefined;
         }
         return undefined;
       },
     } as Request;

     expect(() => getBearerToken(mockRequest)).toThrow("Authorization header is missing");
   });

   it("should throw an error if Authorization header format is invalid (no Bearer prefix)", () => {
     const mockRequest = {
       get: (headerName: string) => {
         if (headerName === "Authorization") {
           return "Token some.jwt.token";
         }
         return undefined;
       },
     } as Request;

     expect(() => getBearerToken(mockRequest)).toThrow("Invalid Authorization header format. Expected 'Bearer TOKEN'.");
   });

   it("should throw an error if Authorization header format is invalid (missing token)", () => {
     const mockRequest = {
       get: (headerName: string) => {
         if (headerName === "Authorization") {
           return "Bearer ";
         }
         return undefined;
       },
     } as Request;

     expect(() => getBearerToken(mockRequest)).toThrow("Invalid Authorization header format. Expected 'Bearer TOKEN'.");
   });
 });