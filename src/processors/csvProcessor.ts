// ===== CSV PROCESSOR =====
import * as fs from 'fs';
import * as path from 'path';
import { FileProcessingConfig, ProcessingResult } from '../models/commonTypes';
import { DataValidator } from '../validation/dataValidator';
import { ExcelReader } from '../utils/excelReader';

export class CSVProcessor {
  
  static async processCSVFile(config: FileProcessingConfig): Promise<ProcessingResult> {
    try {
      console.log(`Processing file: ${config.inputFile}`);
      
      // Read Excel/CSV file
      const rawData = await this.readDataFile(config.inputFile);
      
      let processedRecords = 0;
      let errorRecords = 0;
      const validRecords: any[] = [];
      const allErrors: string[] = [];

      // Process each record
      for (let i = 0; i < rawData.length; i++) {
        const record = rawData[i];
        
        // Filter fields based on whitelist
        const filteredRecord = this.filterFields(record, config.whitelistedFields);
        
        // Validate record
        const validation = DataValidator.validateRecord(filteredRecord, config);
        
        if (validation.isValid) {
          validRecords.push(filteredRecord);
          processedRecords++;
        } else {
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

    } catch (error) {
      console.error(`Error processing ${config.inputFile}:`, error);
      throw error; // Re-throw to allow main process to handle graceful exit
    }
  }

  private static filterFields(record: any, whitelistedFields: string[]): any {
    if (whitelistedFields.length === 0) return record;
    
    const filtered: any = {};
    for (const field of whitelistedFields) {
      if (record.hasOwnProperty(field)) {
        filtered[field] = record[field];
      }
    }
    return filtered;
  }

  private static async readDataFile(filePath: string): Promise<any[]> {
    const extension = path.extname(filePath).toLowerCase();
    
    if (extension === '.xls' || extension === '.xlsx') {
      // Read Excel file (handles encryption)
      return await ExcelReader.readExcelFile(filePath);
    } else if (extension === '.csv') {
      // Read CSV file
      return await this.readCSVFile(filePath);
    } else {
      throw new Error(`Unsupported file format: ${extension}`);
    }
  }

  private static async readCSVFile(filePath: string): Promise<any[]> {
    throw new Error(`CSV file reading not implemented yet for: ${filePath}`);
  }

  private static async writeCSVFile(filePath: string, data: any[]): Promise<void> {
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

  private static convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
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