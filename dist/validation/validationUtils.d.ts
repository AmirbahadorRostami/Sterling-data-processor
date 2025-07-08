import { ValidationResult } from '../models/commonTypes';
export declare class ValidationUtils {
    static validateEmail(email: string): boolean;
    static validateDate(dateString: string): boolean;
    static validateNumber(value: any): boolean;
    static validateRequiredFields(record: any, requiredFields: string[], allowEmptyFields?: boolean): ValidationResult;
}
//# sourceMappingURL=validationUtils.d.ts.map