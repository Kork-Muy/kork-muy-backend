import { IsEmail, IsString, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "johndoe" })
  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Username can only contain letters, numbers, underscores, and hyphens",
  })
  username: string;

  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password: string;
}
