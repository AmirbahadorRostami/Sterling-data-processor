"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUtils = void 0;
class ValidationUtils {
    // Email validation with regex
    static validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    // Date validation with multiple format support
    static validateDate(dateString) {
        if (!dateString)
            return false;
        // Support multiple date formats
        const dateFormats = [
            /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, // YYYY-MM-DD HH:MM:SS
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/, // ISO format
            /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
            /^\d{1,2}\/\d{1,2}\/\d{4}$/ // M/D/YYYY
        ];
        const isFormatValid = dateFormats.some(format => format.test(dateString));
        if (!isFormatValid)
            return false;
        // Try to parse the date
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }
    // Number validation
    static validateNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
    // Required field validation
    static validateRequiredFields(record, requiredFields, allowEmptyFields = false) {
        const errors = [];
        for (const field of requiredFields) {
            const fieldValue = record[field];
            if (allowEmptyFields) {
                // If empty fields are allowed, only check if the field exists (not if it has a value)
                if (fieldValue === undefined) {
                    errors.push(`Missing required field: ${field}`);
                }
            }
            else {
                // If empty fields are not allowed, check both existence and non-empty value
                if (!fieldValue || fieldValue === '') {
                    errors.push(`Missing required field: ${field}`);
                }
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings: []
        };
    }
}
exports.ValidationUtils = ValidationUtils;
//# sourceMappingURL=validationUtils.js.map