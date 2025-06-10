const validateSigninBody = (body, requiredFields) => {
    const missingFields = [];
    requiredFields.forEach((field) => {
        if (body[field] === void 0 || body[field] === null) {
            missingFields.push(field);
        }
    });
    if (missingFields.length > 0) {
        return {
            success: false,
            message: "Missing required fields",
            missingFields
        };
    }
    return { success: true };
}

module.exports = validateSigninBody;