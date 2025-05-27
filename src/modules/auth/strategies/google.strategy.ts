// google.strategy.ts
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, emails, name, photos } = profile;
      console.log("profile validate google", profile);
      const userObj = {
        id,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        avatar: photos[0].value,
        provider: 'google',
        _raw: profile._raw,
        _json: profile._json,
      }
      console.log("userObj validate google", userObj);
      const user = await this.authService.handleSocialLogin(userObj, "google");
      console.log("user validate google", user);
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
