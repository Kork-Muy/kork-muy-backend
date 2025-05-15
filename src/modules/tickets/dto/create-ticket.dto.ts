import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTicketDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ticketTypeId: string;

  @ApiProperty()
  @IsNotEmpty()
  ticketData: {
    name: string;
    price: number;
    description: string;
    seat?: string;
  };

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  encryptedData: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isUsed?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  usedAt?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  transferredFrom?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isTransferable?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}
