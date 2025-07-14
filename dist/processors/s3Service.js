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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Config = exports.S3Service = void 0;
// ===== S3 SERVICE =====
const AWS = __importStar(require("aws-sdk"));
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config();
class S3Service {
    static getBucketName() {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        if (!bucketName) {
            throw new Error('AWS_S3_BUCKET_NAME environment variable is required');
        }
        return bucketName;
    }
    static async downloadFromS3(key) {
        const bucketName = this.getBucketName();
        console.log(`Downloading from s3://${bucketName}/${key}`);
        try {
            const result = await this.s3.getObject({
                Bucket: bucketName,
                Key: key
            }).promise();
            return result.Body;
        }
        catch (error) {
            console.error(`Failed to download from S3: ${error}`);
            throw error;
        }
    }
    static async uploadToS3(key, data) {
        const bucketName = this.getBucketName();
        console.log(`Uploading to s3://${bucketName}/${key}`);
        try {
            await this.s3.putObject({
                Bucket: bucketName,
                Key: key,
                Body: data
            }).promise();
            console.log(`✓ Successfully uploaded to s3://${bucketName}/${key}`);
        }
        catch (error) {
            console.error(`Failed to upload to S3: ${error}`);
            throw error;
        }
    }
    static async listObjects(prefix) {
        const bucketName = this.getBucketName();
        console.log(`Listing objects in s3://${bucketName}/${prefix}`);
        try {
            const result = await this.s3.listObjectsV2({
                Bucket: bucketName,
                Prefix: prefix
            }).promise();
            return result.Contents?.map(obj => obj.Key || '') || [];
        }
        catch (error) {
            console.error(`Failed to list S3 objects: ${error}`);
            throw error;
        }
    }
    static async objectExists(key) {
        const bucketName = this.getBucketName();
        try {
            await this.s3.headObject({
                Bucket: bucketName,
                Key: key
            }).promise();
            return true;
        }
        catch (error) {
            if (error.statusCode === 404) {
                return false;
            }
            throw error;
        }
    }
}
exports.S3Service = S3Service;
_a = S3Service;
(() => {
    // Configure AWS SDK
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1'
    });
    const s3Config = {};
    // Support custom endpoint for testing (LocalStack, etc.)
    if (process.env.AWS_S3_ENDPOINT) {
        s3Config.endpoint = process.env.AWS_S3_ENDPOINT;
        s3Config.s3ForcePathStyle = true;
    }
    _a.s3 = new AWS.S3(s3Config);
})();
// Export S3 path configuration
exports.S3Config = {
    APEX_DATA_PREFIX: process.env.S3_APEX_DATA_PREFIX || '',
    ICAPITAL_DATA_PREFIX: process.env.S3_ICAPITAL_DATA_PREFIX || '',
    OUTPUT_PREFIX: process.env.S3_OUTPUT_PREFIX || 'output/'
};
//# sourceMappingURL=s3Service.js.map