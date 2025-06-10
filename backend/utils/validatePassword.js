const validatePassword = password => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{7,}$/.test(
        password
    );
};


module.exports = validatePassword;

// This regular expression checks for:
// - At least one lowercase letter
// - At least one uppercase letter
// - At least one digit
// - At least one special character from the set !@#$%^&*
// - Minimum length of 7 characters