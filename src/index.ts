// ===== MAIN APPLICATION =====
import * as path from 'path';
import { FileProcessingConfig, ProcessingResult } from './models/commonTypes';
import { FieldFilterConfig } from './validation/fieldFilterConfig';
import { CSVProcessor } from './processors/csvProcessor';
import { S3Config } from './processors/s3Service';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class DataProcessor {
  
  static async processAllFiles(): Promise<void> {
    console.log('🚀 Starting data processing pipeline...');
    
    // Define file processing configurations using actual S3 file names
    const fileConfigs: FileProcessingConfig[] = [
      // APEX Files (in root folder)
      {
        source: 'APEX',
        inputFile: `${S3Config.APEX_DATA_PREFIX}2504080Dummy Report - Shareholding for a shareholder.xls`,
        outputFile: `${S3Config.OUTPUT_PREFIX}apex_shareholding_cleaned.csv`,
        whitelistedFields: FieldFilterConfig.APEX_SHAREHOLDING_FIELDS,
        requiredFields: FieldFilterConfig.APEX_SHAREHOLDING_FIELDS,
        allowEmptyFields: true
      },
      {
        source: 'APEX',
        inputFile: `${S3Config.APEX_DATA_PREFIX}250408 Dummy Report - Shareholder names and addresses.xls`, 
        outputFile: `${S3Config.OUTPUT_PREFIX}apex_contacts_cleaned.csv`,
        whitelistedFields: FieldFilterConfig.APEX_CONTACT_FIELDS,
        requiredFields: FieldFilterConfig.APEX_CONTACT_FIELDS,
        allowEmptyFields: true
      },
      // iCapital Files (in root folder)
      {
        source: 'ICAPITAL',
        inputFile: `${S3Config.ICAPITAL_DATA_PREFIX}user detail report - 2025-03-26 (1).xlsx`,
        outputFile: `${S3Config.OUTPUT_PREFIX}icapital_users_cleaned.csv`,
        whitelistedFields: FieldFilterConfig.ICAPITAL_USER_FIELDS,
        requiredFields: FieldFilterConfig.ICAPITAL_USER_FIELDS,
        allowEmptyFields: true
      },
      {
        source: 'ICAPITAL',
        inputFile: `${S3Config.ICAPITAL_DATA_PREFIX}engagement_activities_2021373_1743001363 (2).xlsx`,
        outputFile: `${S3Config.OUTPUT_PREFIX}icapital_engagement_cleaned.csv`,
        whitelistedFields: FieldFilterConfig.ICAPITAL_ENGAGEMENT_FIELDS,
        requiredFields: FieldFilterConfig.ICAPITAL_ENGAGEMENT_FIELDS,
        allowEmptyFields: true
      }
    ];

    // Process each file
    const results: ProcessingResult[] = [];
    for (const config of fileConfigs) {
      console.log(`\n📁 Processing ${config.source} file: ${config.inputFile}`);
      try {
        const result = await CSVProcessor.processCSVFile(config);
        results.push(result);
      } catch (error) {
        console.error(`❌ Failed to process ${config.inputFile}:`);
        console.error(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('\n🛑 Data processing pipeline stopped due to file read error.');
        process.exit(1);
      }
    }

    // Summary report
    console.log('\n📊 PROCESSING SUMMARY');
    console.log('=====================');
    let totalProcessed = 0;
    let totalErrors = 0;
    
    results.forEach((result, index) => {
      const config = fileConfigs[index];
      console.log(`${config.source} - ${config.inputFile}:`);
      console.log(`  ✓ Processed: ${result.processedRecords} records`);
      console.log(`  ✗ Errors: ${result.errorRecords} records`);
      console.log(`  📁 Output: ${result.outputFile}`);
      
      totalProcessed += result.processedRecords;
      totalErrors += result.errorRecords;
    });

    console.log(`\nTOTAL: ${totalProcessed} processed, ${totalErrors} errors`);
    console.log('🎉 Data processing pipeline completed!');
  }
}

// ===== ENTRY POINT =====
if (require.main === module) {
  DataProcessor.processAllFiles().catch(error => {
    console.error('\n💥 Fatal error in data processing pipeline:');
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  });
}