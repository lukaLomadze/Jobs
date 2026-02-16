export declare class AwsS3Service {
    private s3Service;
    private bucketName;
    constructor();
    uploadFile(fileId: string, buffer: Buffer, contentType: string): Promise<string>;
    uploadPdf(buffer: Buffer): Promise<string>;
    getFile(fileId: string): Promise<string>;
    deleteFile(fileId: string): Promise<string>;
    getSignedUrl(fileId: string): Promise<string>;
}
