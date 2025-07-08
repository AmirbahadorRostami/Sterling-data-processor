// ===== DATA VALIDATOR =====
import { FileProcessingConfig, ValidationResult } from '../models/commonTypes';
import { ValidationUtils } from './validationUtils';

export class DataValidator {
  
  static validateRecord(record: any, config: FileProcessingConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    const requiredValidation = ValidationUtils.validateRequiredFields(record, config.requiredFields, config.allowEmptyFields);
    errors.push(...requiredValidation.errors);

    // Validate email fields
    const emailFields = ['e_mail_address', 'Investor E-mail', 'Advisor E-mail', 'Advisor e-mail', 'Salesperson E-mail', 'Salesperson e-mail', 'Email', 'First Signer e-mail', 'Second Signer e-mail', 'User e-mail'];
    for (const field of emailFields) {
      if (record[field] && !ValidationUtils.validateEmail(record[field])) {
        errors.push(`Invalid email format in ${field}: ${record[field]}`);
      }
    }

    // Validate date fields
    const dateFields = ['run_date', 'valuation_date', 'latest_val_date', 'SETTLEMENT_DATE', 'TRADE_DATE', 'CASH_DATE', 'date_of_birth', 'Invited Date', 'First Date Login', 'Last Date Login', 'First Viewed', 'Last Viewed', 'Date Signed', 'Close Date', 'Date'];
    for (const field of dateFields) {
      if (record[field] && !ValidationUtils.validateDate(record[field])) {
        errors.push(`Invalid date format in ${field}: ${record[field]}`);
      }
    }

    // Validate numeric fields  
    const numericFields = ['SHARE_NAV_PRICE', 'nav_value', 'eq_accrual', 'currency_decimals', 'price_decimals', 'share_decimals', 'percent_holding', 'cost', 'total_lcy', 'Commitment', 'PRICE', 'GROSS_AMOUNT', 'eq_amount', 'fee_amount', 'fee_2_amount', 'net_settlement', 'rounding_adjustment', 'spread_amount', 'fx_rate', 'gross_amount_lcy', 'net_settlement_fcy', 'settlement_fx_rate', 'trailer_fee_rate_pa', 'Amount', 'Fund Visits', 'Page Views - Summary Views', 'Page Views - Terms Views', 'Page Views - Diligence Views', 'Page Views - Performance Views', 'Videos Viewed', 'Video Views', 'Engagement Score', 'Docs Viewed'];
    for (const field of numericFields) {
      if (record[field] !== undefined && record[field] !== '' && !ValidationUtils.validateNumber(record[field])) {
        errors.push(`Invalid number format in ${field}: ${record[field]}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}