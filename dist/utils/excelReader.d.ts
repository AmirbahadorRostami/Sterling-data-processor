export declare class ExcelReader {
    /**
     * Read Excel file (handles both encrypted and unencrypted files)
     */
    static readExcelFile(filePath: string): Promise<any[]>;
    /**
     * Handle encrypted Excel files using officecrypto-tool
     */
    private static readEncryptedExcel;
    /**
     * Get password based on file path
     */
    private static getPasswordForFile;
    /**
     * Read Excel file from buffer (for S3 integration)
     */
    static readExcelFileFromBuffer(buffer: Buffer, s3Key?: string): Promise<any[]>;
    /**
     * Handle encrypted Excel files from buffer
     */
    private static readEncryptedExcelFromBuffer;
    /**
     * Get password based on S3 key
     */
    private static getPasswordForS3Key;
    /**
     * Get file headers without reading all data
     */
    static getExcelHeaders(filePath: string): Promise<string[]>;
}
//# sourceMappingURL=excelReader.d.ts.map