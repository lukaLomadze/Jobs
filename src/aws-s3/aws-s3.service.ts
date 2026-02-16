import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';

@Injectable()
export class AwsS3Service {
  private s3Service: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME!;
    this.s3Service = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        secretAccessKey: process.env.AWS_SECRET_KEY!,
        accessKeyId: process.env.AWS_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(
    fileId: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    if (!fileId || !buffer)
      throw new BadRequestException('File or Buffer is missing');

    const command = new PutObjectCommand({
      Body: buffer,
      Key: fileId,
      Bucket: this.bucketName,
      ContentType: contentType,
    });

    await this.s3Service.send(command);
    return fileId;
  }

  async uploadPdf(buffer: Buffer): Promise<string> {
    const fileId = `cvs/${randomUUID()}.pdf`;
    await this.uploadFile(fileId, buffer, 'application/pdf');
    // Return just the file key (the signed URL endpoint will generate the full URL)
    return fileId;
  }

  async getFile(fileId: string): Promise<string> {
    if (!fileId) throw new BadRequestException('file id is required');

    const command = new GetObjectCommand({
      Key: fileId,
      Bucket: this.bucketName,
    });

    const result = await this.s3Service.send(command);

    if (result.Body instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of result.Body) {
        chunks.push(chunk as Buffer);
      }
      const fileBuffer = Buffer.concat(chunks);
      const base64 = fileBuffer.toString('base64');
      return `data:${result.ContentType};base64,${base64}`;
    }

    throw new BadRequestException('Could not read file');
  }

  async deleteFile(fileId: string): Promise<string> {
    if (!fileId) throw new BadRequestException('file id is required');

    const command = new DeleteObjectCommand({
      Key: fileId,
      Bucket: this.bucketName,
    });

    await this.s3Service.send(command);
    return fileId;
  }

  async getSignedUrl(fileId: string): Promise<string> {
    if (!fileId) throw new BadRequestException('file id is required');

    const command = new GetObjectCommand({
      Key: fileId,
      Bucket: this.bucketName,
    });

    // Generate signed URL valid for 1 hour
    const signedUrl = await getSignedUrl(this.s3Service, command, { expiresIn: 3600 });

    return signedUrl;
  }
}
