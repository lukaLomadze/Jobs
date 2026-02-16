"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const common_1 = require("@nestjs/common");
const stream_1 = require("stream");
const crypto_1 = require("crypto");
let AwsS3Service = class AwsS3Service {
    s3Service;
    bucketName;
    constructor() {
        this.bucketName = process.env.AWS_BUCKET_NAME;
        this.s3Service = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                secretAccessKey: process.env.AWS_SECRET_KEY_,
                accessKeyId: process.env.AWS_ACCESS_KEY_,
            },
        });
    }
    async uploadFile(fileId, buffer, contentType) {
        if (!fileId || !buffer)
            throw new common_1.BadRequestException('File or Buffer is missing');
        const command = new client_s3_1.PutObjectCommand({
            Body: buffer,
            Key: fileId,
            Bucket: this.bucketName,
            ContentType: contentType,
        });
        await this.s3Service.send(command);
        return fileId;
    }
    async uploadPdf(buffer) {
        const fileId = `cvs/${(0, crypto_1.randomUUID)()}.pdf`;
        await this.uploadFile(fileId, buffer, 'application/pdf');
        return fileId;
    }
    async getFile(fileId) {
        if (!fileId)
            throw new common_1.BadRequestException('file id is required');
        const command = new client_s3_1.GetObjectCommand({
            Key: fileId,
            Bucket: this.bucketName,
        });
        const result = await this.s3Service.send(command);
        if (result.Body instanceof stream_1.Readable) {
            const chunks = [];
            for await (const chunk of result.Body) {
                chunks.push(chunk);
            }
            const fileBuffer = Buffer.concat(chunks);
            const base64 = fileBuffer.toString('base64');
            return `data:${result.ContentType};base64,${base64}`;
        }
        throw new common_1.BadRequestException('Could not read file');
    }
    async deleteFile(fileId) {
        if (!fileId)
            throw new common_1.BadRequestException('file id is required');
        const command = new client_s3_1.DeleteObjectCommand({
            Key: fileId,
            Bucket: this.bucketName,
        });
        await this.s3Service.send(command);
        return fileId;
    }
    async getSignedUrl(fileId) {
        if (!fileId)
            throw new common_1.BadRequestException('file id is required');
        const command = new client_s3_1.GetObjectCommand({
            Key: fileId,
            Bucket: this.bucketName,
        });
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Service, command, { expiresIn: 3600 });
        return signedUrl;
    }
};
exports.AwsS3Service = AwsS3Service;
exports.AwsS3Service = AwsS3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AwsS3Service);
//# sourceMappingURL=aws-s3.service.js.map