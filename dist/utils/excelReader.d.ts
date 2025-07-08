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
     * Get file headers without reading all data
     */
    static getExcelHeaders(filePath: string): Promise<string[]>;
}
//# sourceMappingURL=excelReader.d.ts.map