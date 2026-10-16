

export function validateUser(email: string, password: string): string {
    if (!email || !password) {
        return "Email and password are required.";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }
    return "";

}

export function validateSignUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
): string {
    if (!email || !password) {
        return "Email and password are required.";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }
    if (!firstName || firstName.length < 1) {
        return "First name must be at least 1 character long.";
    }
    if (!lastName || lastName.length < 1) {
        return "Last name must be at least 1 character long.";
    }
    if (!phoneNumber || phoneNumber.length < 10) {
        return "Phone number must be at least 10 characters long.";
    }
    if (!containsOnlyDigits(phoneNumber)) {
        return "Phone number can only contain digits.";
    }

    return "";

}

function containsOnlyDigits(phone: string): boolean {
    for (let i = 0; i < phone.length; i++) {
        const char: string = phone.charAt(i);
        if (char < "0" || char > "9") {
            return false;
        }
    }
    return true;
}

export function validateUpdateUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
): string {
    if (!email) {
        return "Email is required.";
    }
    if (firstName && firstName.length < 1) {
        return "First name must be at least 1 character long.";
    }
    if (lastName && lastName.length < 1) {
        return "Last name must be at least 1 character long.";
    }
    if (password && password.length < 6) {
        return "Password must be at least 6 characters long.";
    }
    if (phoneNumber) {
        if (phoneNumber.length < 10) {
            return "Phone number must be at least 10 characters long.";
        }
        if (!containsOnlyDigits(phoneNumber)) {
            return "Phone number can only contain digits.";
        }
    }
    return "";
}

