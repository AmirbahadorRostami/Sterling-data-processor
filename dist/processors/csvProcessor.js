"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVProcessor = void 0;
// ===== CSV PROCESSOR =====
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dataValidator_1 = require("../validation/dataValidator");
const excelReader_1 = require("../utils/excelReader");
class CSVProcessor {
    static async processCSVFile(config) {
        try {
            console.log(`Processing file: ${config.inputFile}`);
            // Read Excel/CSV file
            const rawData = await this.readDataFile(config.inputFile);
            let processedRecords = 0;
            let errorRecords = 0;
            const validRecords = [];
            const allErrors = [];
            // Process each record
            for (let i = 0; i < rawData.length; i++) {
                const record = rawData[i];
                // Filter fields based on whitelist
                const filteredRecord = this.filterFields(record, config.whitelistedFields);
                // Validate record
                const validation = dataValidator_1.DataValidator.validateRecord(filteredRecord, config);
                if (validation.isValid) {
                    validRecords.push(filteredRecord);
                    processedRecords++;
                }
                else {
                    errorRecords++;
                    allErrors.push(`Row ${i + 1}: ${validation.errors.join(', ')}`);
                }
            }
            // Write output CSV
            await this.writeCSVFile(config.outputFile, validRecords);
            console.log(`✓ Processed ${processedRecords} records, ${errorRecords} errors`);
            return {
                success: true,
                processedRecords,
                errorRecords,
                outputFile: config.outputFile,
                validationReport: {
                    isValid: errorRecords === 0,
                    errors: allErrors,
                    warnings: []
                }
            };
        }
        catch (error) {
            console.error(`Error processing ${config.inputFile}:`, error);
            throw error; // Re-throw to allow main process to handle graceful exit
        }
    }
    static filterFields(record, whitelistedFields) {
        if (whitelistedFields.length === 0)
            return record;
        const filtered = {};
        for (const field of whitelistedFields) {
            if (record.hasOwnProperty(field)) {
                filtered[field] = record[field];
            }
        }
        return filtered;
    }
    static async readDataFile(filePath) {
        const extension = path.extname(filePath).toLowerCase();
        if (extension === '.xls' || extension === '.xlsx') {
            // Read Excel file (handles encryption)
            return await excelReader_1.ExcelReader.readExcelFile(filePath);
        }
        else if (extension === '.csv') {
            // Read CSV file
            return await this.readCSVFile(filePath);
        }
        else {
            throw new Error(`Unsupported file format: ${extension}`);
        }
    }
    static async readCSVFile(filePath) {
        throw new Error(`CSV file reading not implemented yet for: ${filePath}`);
    }
    static async writeCSVFile(filePath, data) {
        // This is a placeholder - in real implementation, you'd use csv-writer
        console.log(`Would write ${data.length} records to ${filePath}`);
        // Create output directory if it doesn't exist
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // In real implementation, convert data to CSV and write
        const csvContent = this.convertToCSV(data);
        fs.writeFileSync(filePath, csvContent);
    }
    static convertToCSV(data) {
        if (data.length === 0)
            return '';
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header] || '';
                // Escape commas and quotes
                return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                    ? `"${value.replace(/"/g, '""')}"`
                    : value;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    }
}
exports.CSVProcessor = CSVProcessor;
//# sourceMappingURL=csvProcessor.js.map