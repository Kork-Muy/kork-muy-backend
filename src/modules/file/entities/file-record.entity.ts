import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, Generated } from "typeorm";

@Entity()
export class FileRecord {
  @PrimaryColumn({ type: "uuid" })
  @Generated("uuid")
  id: string;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column()
  fileType: string;

  @Column()
  fileSize: number;

  @Column()
  fileExtension: string;

  @Column()
  fileCreatedAt: Date;
}