// ===== CSV PROCESSOR =====
import * as fs from 'fs';
import * as path from 'path';
import { FileProcessingConfig, ProcessingResult } from '../models/commonTypes';
import { DataValidator } from '../validation/dataValidator';
import { ExcelReader } from '../utils/excelReader';
import { S3Service } from './s3Service';

export class CSVProcessor {
  
  static async processCSVFile(config: FileProcessingConfig): Promise<ProcessingResult> {
    try {
      console.log(`Processing file: ${config.inputFile}`);
      
      // Read Excel/CSV file from S3
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

  private static async readDataFile(s3Key: string): Promise<any[]> {
    const extension = path.extname(s3Key).toLowerCase();
    
    if (extension === '.xls' || extension === '.xlsx') {
      // Download Excel file from S3 and read it
      const buffer = await S3Service.downloadFromS3(s3Key);
      return await ExcelReader.readExcelFileFromBuffer(buffer, s3Key);
    } else if (extension === '.csv') {
      // Download and read CSV file from S3
      return await this.readCSVFileFromS3(s3Key);
    } else {
      throw new Error(`Unsupported file format: ${extension}`);
    }
  }

  private static async readCSVFileFromS3(s3Key: string): Promise<any[]> {
    const buffer = await S3Service.downloadFromS3(s3Key);
    const csvContent = buffer.toString('utf8');
    
    // Parse CSV content
    const lines = csvContent.split('\n');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data: any[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(',').map(v => v.trim());
        const record: any = {};
        headers.forEach((header, index) => {
          record[header] = values[index] || '';
        });
        data.push(record);
      }
    }
    
    return data;
  }

  private static async writeCSVFile(s3Key: string, data: any[]): Promise<void> {
    console.log(`Writing ${data.length} records to S3: ${s3Key}`);
    
    // Convert data to CSV format
    const csvContent = this.convertToCSV(data);
    
    // Upload to S3
    await S3Service.uploadToS3(s3Key, csvContent);
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