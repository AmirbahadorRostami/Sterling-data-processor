# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

- `npm run build` - Compiles TypeScript to JavaScript in the `dist/` directory
- `npm run dev` - Builds and runs the application (`tsc && node dist/index.js`)
- `npm start` - Runs the compiled application from `dist/index.js`

## Application Architecture

### Core Purpose
This is a data processing pipeline that standardizes financial data from two sources:
- **APEX**: Fund administration system (shareholding, transactions, contact data)
- **iCapital**: Investment platform (user details, investments, engagement metrics)

### Processing Flow
1. **Configuration-driven**: Each file has a `FileProcessingConfig` defining input/output paths, field whitelists, and validation rules
2. **Field filtering**: Only whitelisted fields are retained from source data
3. **Validation**: Records must pass required field checks, email validation, date format validation, and numeric validation
4. **Output**: Clean CSV files are written to the `output/` directory

### Key Components

- **`src/index.ts`**: Main application entry point with `DataProcessor.processAllFiles()`
- **`src/processors/csvProcessor.ts`**: Handles CSV reading/writing and orchestrates processing
- **`src/validation/`**: Data validation logic including field requirements and format checks
- **`src/models/`**: TypeScript interfaces for processing configuration and results
- **`src/validation/fieldFilterConfig.ts`**: Extensive field whitelists for each data source

### Data Sources
- APEX files: `data/apex/` (shareholding, transactions, contacts)
- iCapital files: `data/icapital/` (user details, investments, engagement activities)
- Output files: `output/` (cleaned CSV files)

### Field Filtering System
The application uses comprehensive field whitelists defined in `FieldFilterConfig` to ensure only relevant data is processed. Each source has specific field mappings for different file types.

## TypeScript Configuration
- Target: ES2020 with strict type checking enabled
- Path aliases: `@/*` maps to `src/*`
- Outputs declaration files and source maps