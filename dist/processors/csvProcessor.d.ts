import { FileProcessingConfig, ProcessingResult } from '../models/commonTypes';
export declare class CSVProcessor {
    static processCSVFile(config: FileProcessingConfig): Promise<ProcessingResult>;
    private static filterFields;
    private static readDataFile;
    private static readCSVFile;
    private static writeCSVFile;
    private static convertToCSV;
}
//# sourceMappingURL=csvProcessor.d.ts.map