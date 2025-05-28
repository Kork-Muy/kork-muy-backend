import { IsNotEmpty, IsString } from "class-validator";

export class CheckInTicketDto {
  @IsNotEmpty()
  @IsString()
  qrcode: string;

  @IsNotEmpty()
  @IsString()
  eventId: string;
}