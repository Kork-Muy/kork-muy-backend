import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileRecord } from "./entities/file-record.entity";
import { MinioService } from "src/shared/minio/minio.service";
import { BufferedFile } from "src/shared/minio/file.model";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FileService {

  constructor(
    @InjectRepository(FileRecord)
    private readonly fileRepository: Repository<FileRecord>,
    private readonly minioService: MinioService,
  ) {}

  async uploadFile(file: BufferedFile) {
    console.log("Uploading file to MinIO", file);
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}`;
    console.log("File name", fileName);
    const fileUrl = await this.minioService.upload(file, fileName);
    const fileRecord = new FileRecord();
    fileRecord.fileName = fileName;
    fileRecord.fileUrl = fileUrl;
    fileRecord.fileType = file.mimetype;
    fileRecord.fileSize = file.size;
    fileRecord.fileExtension = fileExtension || '';
    fileRecord.fileCreatedAt = new Date();
    await this.fileRepository.save(fileRecord);
    return {
        url: await this.minioService.getFileUrl(fileUrl),
        filePath: fileUrl,
    }
  }

  async getFileUrl(filePath: string) {
    return await this.minioService.getFileUrl(filePath);
  }

}

