// src/modules/events/dto/create-event.dto.ts
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ required: false })
  @IsOptional()
  coordinates?: { lat: number; lng: number };

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  minLevel?: number;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  maxAttendees?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  ticketTypes?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
  }[];

  @ApiProperty({ default: [] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}