"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderExtractor = void 0;
// ===== HEADER EXTRACTOR UTILITY =====
const excelReader_1 = require("./excelReader");
class HeaderExtractor {
    static async extractAllHeaders() {
        const files = [
            { name: 'APEX Shareholding', path: './data/apex/Shareholding for a shareholder.xls' },
            { name: 'APEX Transactions', path: './data/apex/Shareholder transactions.xls' },
            { name: 'APEX Contacts', path: './data/apex/Shareholder names and addresses.xls' },
            { name: 'iCapital Users', path: './data/icapital/user detail report.xlsx' },
            { name: 'iCapital Investments', path: './data/icapital/investment detail report.xlsx' },
            { name: 'iCapital Engagement', path: './data/icapital/engagement_activities.xlsx' }
        ];
        for (const file of files) {
            try {
                console.log(`\n=== ${file.name} (${file.path}) ===`);
                const headers = await excelReader_1.ExcelReader.getExcelHeaders(file.path);
                console.log(`Column count: ${headers.length}`);
                console.log('Headers:');
                headers.forEach((header, index) => {
                    console.log(`  ${index + 1}. '${header}'`);
                });
                // Format for TypeScript array
                console.log('\nTypeScript array format:');
                console.log('[');
                headers.forEach(header => {
                    console.log(`  '${header}',`);
                });
                console.log(']');
            }
            catch (error) {
                console.error(`Error reading ${file.name}: ${error}`);
            }
        }
    }
}
exports.HeaderExtractor = HeaderExtractor;
// Run if called directly
if (require.main === module) {
    HeaderExtractor.extractAllHeaders().catch(console.error);
}
//# sourceMappingURL=headerExtractor.js.map