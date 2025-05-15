// facebook.strategy.ts
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>("FACEBOOK_APP_ID"),
      clientSecret: configService.get<string>("FACEBOOK_APP_SECRET"),
      callbackURL: configService.get<string>("FACEBOOK_CALLBACK_URL"),
      profileFields: ["id", "emails", "name", "picture.type(large)"],
      scope: ["email"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      const user = await this.authService.handleSocialLogin(
        profile,
        "facebook",
      );
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
