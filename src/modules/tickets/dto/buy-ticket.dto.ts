import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TicketDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class BuyTicketDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  ticketData: TicketDataDto[];
}
