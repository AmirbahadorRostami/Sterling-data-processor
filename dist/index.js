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
exports.DataProcessor = void 0;
// ===== MAIN APPLICATION =====
const path = __importStar(require("path"));
const fieldFilterConfig_1 = require("./validation/fieldFilterConfig");
const csvProcessor_1 = require("./processors/csvProcessor");
class DataProcessor {
    static async processAllFiles() {
        console.log('🚀 Starting data processing pipeline...');
        // Define file processing configurations
        const fileConfigs = [
            // APEX Files
            {
                source: 'APEX',
                inputFile: './data/apex/Shareholding for a shareholder.xls',
                outputFile: './output/apex_shareholding_cleaned.csv',
                whitelistedFields: fieldFilterConfig_1.FieldFilterConfig.APEX_SHAREHOLDING_FIELDS,
                requiredFields: fieldFilterConfig_1.FieldFilterConfig.APEX_SHAREHOLDING_FIELDS,
                allowEmptyFields: true
            },
            {
                source: 'APEX',
                inputFile: './data/apex/Shareholder transactions.xls',
                outputFile: './output/apex_transactions_cleaned.csv',
                whitelistedFields: fieldFilterConfig_1.FieldFilterConfig.APEX_TRANSACTION_FIELDS,
                requiredFields: fieldFilterConfig_1.FieldFilterConfig.APEX_TRANSACTION_FIELDS,
                allowEmptyFields: true
            },
            {
                source: 'APEX',
                inputFile: './data/apex/Shareholder names and addresses.xls',
                outputFile: './output/apex_contacts_cleaned.csv',
                whitelistedFields: fieldFilterConfig_1.FieldFilterConfig.APEX_CONTACT_FIELDS,
                requiredFields: fieldFilterConfig_1.FieldFilterConfig.APEX_CONTACT_FIELDS,
                allowEmptyFields: true
            },
            // iCapital Files
            {
                source: 'ICAPITAL',
                inputFile: './data/icapital/user detail report.xlsx',
                outputFile: './output/icapital_users_cleaned.csv',
                whitelistedFields: fieldFilterConfig_1.FieldFilterConfig.ICAPITAL_USER_FIELDS,
                requiredFields: fieldFilterConfig_1.FieldFilterConfig.ICAPITAL_USER_FIELDS,
                allowEmptyFields: true
            },
            {
                source: 'ICAPITAL',
                inputFile: './data/icapital/investment detail report.xlsx',
                outputFile: './output/icapital_investments_cleaned.csv',
                whitelistedFields: fieldFilterConfig_1.FieldFilterConfig.ICAPITAL_INVESTMENT_FIELDS,
                requiredFields: fieldFilterConfig_1.FieldFilterConfig.ICAPITAL_INVESTMENT_FIELDS,
                allowEmptyFields: true
            },
            {
                source: 'ICAPITAL',
                inputFile: './data/icapital/engagement_activities.xlsx',
                outputFile: './output/icapital_engagement_cleaned.csv',
                whitelistedFields: fieldFilterConfig_1.FieldFilterConfig.ICAPITAL_ENGAGEMENT_FIELDS,
                requiredFields: fieldFilterConfig_1.FieldFilterConfig.ICAPITAL_ENGAGEMENT_FIELDS,
                allowEmptyFields: true
            }
        ];
        // Process each file
        const results = [];
        for (const config of fileConfigs) {
            console.log(`\n📁 Processing ${config.source} file: ${path.basename(config.inputFile)}`);
            try {
                const result = await csvProcessor_1.CSVProcessor.processCSVFile(config);
                results.push(result);
            }
            catch (error) {
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
            console.log(`${config.source} - ${path.basename(config.inputFile)}:`);
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
exports.DataProcessor = DataProcessor;
// ===== ENTRY POINT =====
if (require.main === module) {
    DataProcessor.processAllFiles().catch(error => {
        console.error('\n💥 Fatal error in data processing pipeline:');
        console.error(error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map