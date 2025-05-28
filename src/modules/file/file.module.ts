import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileRecord } from "./entities/file-record.entity";
import { MinioClientModule } from "src/shared/minio/minio.module";

@Module({
  imports: [TypeOrmModule.forFeature([FileRecord]), MinioClientModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}