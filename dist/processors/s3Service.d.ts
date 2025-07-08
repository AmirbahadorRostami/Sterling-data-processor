export declare class S3Service {
    static downloadFromS3(bucketName: string, key: string): Promise<Buffer>;
    static uploadToS3(bucketName: string, key: string, data: Buffer): Promise<void>;
}
//# sourceMappingURL=s3Service.d.ts.map