import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { BufferedFile } from './file.model';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    const minioConfig = this.configService.get('minio');
    this.bucketName = minioConfig.bucketName;

    this.minioClient = new Minio.Client({
      endPoint: minioConfig.endPoint,
      port: minioConfig.port,
      useSSL: minioConfig.useSSL,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    });
  }

  async onModuleInit() {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName);
      }
    } catch (error) {
      console.error('MinIO initialization error:', error);
      throw error;
    }
  }

  async upload(file: BufferedFile, path: string): Promise<string> {
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': '1234',
    };

    const objectName = `${path}/${Date.now()}-${file.originalname}`;

    try {
      await this.minioClient.putObject(
        this.bucketName,
        objectName,
        file.buffer,
        metaData as any,
      );

      return objectName;
    } catch (error) {
      throw error;
    }
  }

  async delete(objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, objectName);
    } catch (error) {
      throw error;
    }
  }

  async getFileUrl(objectName: string): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        objectName,
        24 * 60 * 60, // 24 hours expiry
      );
    } catch (error) {
      throw error;
    }
  }
} 