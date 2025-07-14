// ===== S3 SERVICE =====
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class S3Service {
  private static s3: AWS.S3;
  
  static {
    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });
    
    const s3Config: AWS.S3.Types.ClientConfiguration = {};
    
    // Support custom endpoint for testing (LocalStack, etc.)
    if (process.env.AWS_S3_ENDPOINT) {
      s3Config.endpoint = process.env.AWS_S3_ENDPOINT;
      s3Config.s3ForcePathStyle = true;
    }
    
    this.s3 = new AWS.S3(s3Config);
  }
  
  static getBucketName(): string {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is required');
    }
    return bucketName;
  }
  
  static async downloadFromS3(key: string): Promise<Buffer> {
    const bucketName = this.getBucketName();
    console.log(`Downloading from s3://${bucketName}/${key}`);
    
    try {
      const result = await this.s3.getObject({ 
        Bucket: bucketName, 
        Key: key 
      }).promise();
      
      return result.Body as Buffer;
    } catch (error) {
      console.error(`Failed to download from S3: ${error}`);
      throw error;
    }
  }

  static async uploadToS3(key: string, data: Buffer | string): Promise<void> {
    const bucketName = this.getBucketName();
    console.log(`Uploading to s3://${bucketName}/${key}`);
    
    try {
      await this.s3.putObject({ 
        Bucket: bucketName, 
        Key: key, 
        Body: data 
      }).promise();
      
      console.log(`✓ Successfully uploaded to s3://${bucketName}/${key}`);
    } catch (error) {
      console.error(`Failed to upload to S3: ${error}`);
      throw error;
    }
  }
  
  static async listObjects(prefix: string): Promise<string[]> {
    const bucketName = this.getBucketName();
    console.log(`Listing objects in s3://${bucketName}/${prefix}`);
    
    try {
      const result = await this.s3.listObjectsV2({ 
        Bucket: bucketName, 
        Prefix: prefix 
      }).promise();
      
      return result.Contents?.map(obj => obj.Key || '') || [];
    } catch (error) {
      console.error(`Failed to list S3 objects: ${error}`);
      throw error;
    }
  }
  
  static async objectExists(key: string): Promise<boolean> {
    const bucketName = this.getBucketName();
    
    try {
      await this.s3.headObject({ 
        Bucket: bucketName, 
        Key: key 
      }).promise();
      
      return true;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }
}

// Export S3 path configuration
export const S3Config = {
  APEX_DATA_PREFIX: process.env.S3_APEX_DATA_PREFIX || '',
  ICAPITAL_DATA_PREFIX: process.env.S3_ICAPITAL_DATA_PREFIX || '',
  OUTPUT_PREFIX: process.env.S3_OUTPUT_PREFIX || 'output/'
};