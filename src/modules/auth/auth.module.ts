// auth.module.ts
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { FacebookStrategy } from "./strategies/facebook.strategy";
import { GithubStrategy } from "./strategies/github.strategy";
import { UsersService } from "../users/users.service";

@Module({
  imports: [
    UsersModule,
    PassportModule,
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
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
