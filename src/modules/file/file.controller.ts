import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { BufferedFile } from "src/shared/minio/file.model";

@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: BufferedFile) {
    return this.fileService.uploadFile(file);
  }

  @Get("get-file-url")  
  async getFileUrl(@Query("filePath") filePath: string) {
    return this.fileService.getFileUrl(filePath);
  }
}   