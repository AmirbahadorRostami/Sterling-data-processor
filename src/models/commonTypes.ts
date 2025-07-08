// ===== COMMON TYPES =====
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProcessingResult {
  success: boolean;
  processedRecords: number;
  errorRecords: number;
  outputFile: string;
  validationReport: ValidationResult;
}

export interface FileProcessingConfig {
  source: 'APEX' | 'ICAPITAL';
  inputFile: string;
  outputFile: string;
  whitelistedFields: string[];
  requiredFields: string[];
  allowEmptyFields: boolean;
}