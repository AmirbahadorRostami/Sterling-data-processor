// ===== EXCEL FILE READER =====
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
const officecrypto = require('officecrypto-tool');

// Global password constants
const APEX_PASSWORD = 'Sterling24!';
const ICAPITAL_PASSWORD = 'Sterling2025';

export class ExcelReader {
  
  /**
   * Read Excel file (handles both encrypted and unencrypted files)
   */
  static async readExcelFile(filePath: string): Promise<any[]> {
    try {
      console.log(`Reading Excel file: ${filePath}`);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      let workbook: XLSX.WorkBook;
      
      // Try to read directly first (for unencrypted files)
      try {
        workbook = XLSX.readFile(filePath);
      } catch (error) {
        console.log('File appears to be encrypted, attempting to decrypt...');
        
        // Handle encrypted files using officecrypto-tool
        workbook = await this.readEncryptedExcel(filePath);
      }

      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, // Use array format first to handle headers properly
        defval: '' // Default value for empty cells
      });

      // Convert array format to object format with proper headers
      if (jsonData.length === 0) {
        return [];
      }

      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1) as any[][];
      
      const result = rows.map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      console.log(`✓ Successfully read ${result.length} rows from ${path.basename(filePath)}`);
      console.log(`Headers found: ${headers.length} columns`);
      
      return result;
      
    } catch (error) {
      console.error(`Error reading Excel file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Handle encrypted Excel files using officecrypto-tool
   */
  private static async readEncryptedExcel(filePath: string): Promise<XLSX.WorkBook> {
    try {
      // Determine password based on file path
      const password = this.getPasswordForFile(filePath);
      
      console.log(`Attempting to decrypt with password for ${path.basename(filePath)}`);
      
      // Read the encrypted file as buffer
      const encryptedBuffer = fs.readFileSync(filePath);
      
      // Use officecrypto-tool to decrypt
      const decryptedBuffer = await officecrypto.decrypt(encryptedBuffer, { password: password });
      
      // Parse the decrypted buffer with xlsx
      const workbook = XLSX.read(decryptedBuffer, { type: 'buffer' });
      
      console.log('✓ Successfully decrypted file');
      
      return workbook;
      
    } catch (error) {
      throw new Error(`Could not decrypt file with the configured password: ${error}`);
    }
  }

  /**
   * Get password based on file path
   */
  private static getPasswordForFile(filePath: string): string {
    const normalizedPath = filePath.toLowerCase();
    
    if (normalizedPath.includes('/apex/') || normalizedPath.includes('\\apex\\')) {
      return APEX_PASSWORD;
    } else if (normalizedPath.includes('/icapital/') || normalizedPath.includes('\\icapital\\')) {
      return ICAPITAL_PASSWORD;
    } else {
      throw new Error(`Unknown file location - cannot determine password for: ${filePath}`);
    }
  }

  /**
   * Read Excel file from buffer (for S3 integration)
   */
  static async readExcelFileFromBuffer(buffer: Buffer, s3Key?: string): Promise<any[]> {
    try {
      console.log(`Reading Excel file from buffer${s3Key ? ` (${s3Key})` : ''}`);
      
      let workbook: XLSX.WorkBook;
      
      // Try to read directly first (for unencrypted files)
      try {
        workbook = XLSX.read(buffer, { type: 'buffer' });
      } catch (error) {
        console.log('Buffer appears to be encrypted, attempting to decrypt...');
        
        // Handle encrypted files using officecrypto-tool
        workbook = await this.readEncryptedExcelFromBuffer(buffer, s3Key);
      }

      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, // Use array format first to handle headers properly
        defval: '' // Default value for empty cells
      });

      // Convert array format to object format with proper headers
      if (jsonData.length === 0) {
        return [];
      }

      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1) as any[][];
      
      const result = rows.map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      console.log(`✓ Successfully read ${result.length} rows from buffer`);
      console.log(`Headers found: ${headers.length} columns`);
      
      return result;
      
    } catch (error) {
      console.error(`Error reading Excel file from buffer:`, error);
      throw error;
    }
  }

  /**
   * Handle encrypted Excel files from buffer
   */
  private static async readEncryptedExcelFromBuffer(buffer: Buffer, s3Key?: string): Promise<XLSX.WorkBook> {
    try {
      // Determine password based on S3 key
      const password = this.getPasswordForS3Key(s3Key);
      
      console.log(`Attempting to decrypt buffer with password`);
      
      // Use officecrypto-tool to decrypt
      const decryptedBuffer = await officecrypto.decrypt(buffer, { password: password });
      
      // Parse the decrypted buffer with xlsx
      const workbook = XLSX.read(decryptedBuffer, { type: 'buffer' });
      
      console.log('✓ Successfully decrypted buffer');
      
      return workbook;
      
    } catch (error) {
      throw new Error(`Could not decrypt buffer with the configured password: ${error}`);
    }
  }

  /**
   * Get password based on S3 key
   */
  private static getPasswordForS3Key(s3Key?: string): string {
    if (!s3Key) {
      // Default to APEX password if we don't have a key
      return APEX_PASSWORD;
    }
    
    const normalizedKey = s3Key.toLowerCase();
    
    // Check for folder structure first
    if (normalizedKey.includes('/apex/') || normalizedKey.includes('apex/')) {
      return APEX_PASSWORD;
    } else if (normalizedKey.includes('/icapital/') || normalizedKey.includes('icapital/')) {
      return ICAPITAL_PASSWORD;
    }
    
    // For root folder files, determine by file name patterns
    if (normalizedKey.includes('shareholding') || 
        normalizedKey.includes('shareholder') || 
        normalizedKey.includes('transaction') || 
        normalizedKey.includes('names and addresses')) {
      return APEX_PASSWORD;
    } else if (normalizedKey.includes('user detail') || 
               normalizedKey.includes('investment detail') || 
               normalizedKey.includes('engagement')) {
      return ICAPITAL_PASSWORD;
    } else {
      // Default to APEX password for unknown files
      return APEX_PASSWORD;
    }
  }

  /**
   * Get file headers without reading all data
   */
  static async getExcelHeaders(filePath: string): Promise<string[]> {
    try {
      const data = await this.readExcelFile(filePath);
      if (data.length === 0) {
        return [];
      }
      return Object.keys(data[0]);
    } catch (error) {
      console.error(`Error reading headers from ${filePath}:`, error);
      return [];
    }
  }
}