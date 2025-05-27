// auth.module.ts
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { FacebookStrategy } from "./strategies/facebook.strategy";
import { GithubStrategy } from "./strategies/github.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAuth } from "./entities/user-auth.entity";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserAuth, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "7d" },
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
    UsersService,
  ],
  controllers: [AuthController],
  exports: [
    AuthService, 
    UsersService,
    TypeOrmModule.forFeature([UserAuth, User])
  ],
})
export class AuthModule {}
