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
const path = __importStar(require("path"));
const dataValidator_1 = require("../validation/dataValidator");
const excelReader_1 = require("../utils/excelReader");
const s3Service_1 = require("./s3Service");
class CSVProcessor {
    static async processCSVFile(config) {
        try {
            console.log(`Processing file: ${config.inputFile}`);
            // Read Excel/CSV file from S3
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
            // Write output CSV to S3
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
    static async readDataFile(s3Key) {
        const extension = path.extname(s3Key).toLowerCase();
        if (extension === '.xls' || extension === '.xlsx') {
            // Download Excel file from S3 and read it
            const buffer = await s3Service_1.S3Service.downloadFromS3(s3Key);
            return await excelReader_1.ExcelReader.readExcelFileFromBuffer(buffer, s3Key);
        }
        else if (extension === '.csv') {
            // Download and read CSV file from S3
            return await this.readCSVFileFromS3(s3Key);
        }
        else {
            throw new Error(`Unsupported file format: ${extension}`);
        }
    }
    static async readCSVFileFromS3(s3Key) {
        const buffer = await s3Service_1.S3Service.downloadFromS3(s3Key);
        const csvContent = buffer.toString('utf8');
        // Parse CSV content
        const lines = csvContent.split('\n');
        if (lines.length === 0)
            return [];
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const values = line.split(',').map(v => v.trim());
                const record = {};
                headers.forEach((header, index) => {
                    record[header] = values[index] || '';
                });
                data.push(record);
            }
        }
        return data;
    }
    static async writeCSVFile(s3Key, data) {
        console.log(`Writing ${data.length} records to S3: ${s3Key}`);
        // Convert data to CSV format
        const csvContent = this.convertToCSV(data);
        // Upload to S3
        await s3Service_1.S3Service.uploadToS3(s3Key, csvContent);
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