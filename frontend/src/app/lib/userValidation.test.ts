
import { validateUser, validateSignUp } from "./userValidation";

describe("validateUser", () => {
    it("should return an error when email and password are missing", () => {
        const result = validateUser("", "");

        expect(result).toBe("Email and password are required.");
    });

    it("should return an error when the password is shorter than 6 characters", () => {
        const result = validateUser("test@example.com", "12345");

        expect(result).toBe("Password must be at least 6 characters long.");
    });

    it("should return an empty string when the login information is valid", () => {
        const result = validateUser("test@example.com", "password123");

        expect(result).toBe("");
    });
});

describe("validateSignUp", () => {
    it("should return an error when email and password are missing", () => {
        const result = validateSignUp("", "", "Jeff", "Thao", "1234567890");

        expect(result).toBe("Email and password are required.");
    });

    it("should return an error when the password is too short", () => {
        const result = validateSignUp(
            "test@example.com", "12345", "Jeff", "Thao", "1234567890"
        );

        expect(result).toBe("Password must be at least 6 characters long.");
    });

    it("should return an error when the first name is missing", () => {
        const result = validateSignUp(
            "test@example.com", "password123", "", "Thao", "1234567890"
        );

        expect(result).toBe("First name must be at least 1 character long.");
    });

    it("should return an error when the last name is missing", () => {
        const result = validateSignUp(
            "test@example.com", "password123", "Jeff", "", "1234567890"
        );

        expect(result).toBe("Last name must be at least 1 character long.");
    });

    it("should return an error when the phone number is too short", () => {
        const result = validateSignUp(
            "test@example.com", "password123", "Jeff", "Thao", "123456789"
        );

        expect(result).toBe("Phone number must be at least 10 characters long.");
    });

    it("should return an error when the phone number contains non-digit characters", () => {
        const result = validateSignUp(
            "test@example.com", "password123", "Jeff", "Thao", "123-456-7890"
        );

        expect(result).toBe("Phone number can only contain digits.");
    });

    it("should return an empty string when all sign-up information is valid", () => {
        const result = validateSignUp(
            "test@example.com", "password123", "Jeff", "Thao", "1234567890"
        );

        expect(result).toBe("");
    });
});
