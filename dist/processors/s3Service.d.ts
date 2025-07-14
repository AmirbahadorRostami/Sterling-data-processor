export declare class S3Service {
    private static s3;
    static getBucketName(): string;
    static downloadFromS3(key: string): Promise<Buffer>;
    static uploadToS3(key: string, data: Buffer | string): Promise<void>;
    static listObjects(prefix: string): Promise<string[]>;
    static objectExists(key: string): Promise<boolean>;
}
export declare const S3Config: {
    APEX_DATA_PREFIX: string;
    ICAPITAL_DATA_PREFIX: string;
    OUTPUT_PREFIX: string;
};
//# sourceMappingURL=s3Service.d.ts.map