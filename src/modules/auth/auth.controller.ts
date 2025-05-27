// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { JwtCookieGuard } from "./guards/jwt-cookie.guard";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: Request, @Res() res: Response) {
    const { user } = await this.authService.login(req.user, "local", res);
    return res.json(user);
  }

  @UseGuards(JwtCookieGuard)
  @Get("profile")
  getProfile(@Req() req: Request) {
    const { user } = req;
    return user;
  }

  @Post("refresh-token")
  renewAccessToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshToken(req, res);
  }

  // Google Auth
  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {
    // Initiates the Google OAuth2 login flow
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {

    console.log("google/callback", req.user.user);
    const { user } = await this.authService.handleSocialLogin(req.user.user, "google", res);

    const redirectUrl = `${process.env.FRONTEND_URL}/auth/social-callback`;
    return res.redirect(redirectUrl);
  }

  // Facebook Auth
  @Get("facebook")
  @UseGuards(AuthGuard("facebook"))
  facebookAuth() {
    // Initiates the Facebook OAuth2 login flow
  }

  @Get("facebook/callback")
  @UseGuards(AuthGuard("facebook"))
  facebookAuthCallback(@Req() req: any, @Res() res: any) {
    const token = req.user.access_token;
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/social-callback?token=${token}`,
    );
  }

  // GitHub Auth
  @Get("github")
  @UseGuards(AuthGuard("github"))
  githubAuth() {
    // Initiates the GitHub OAuth2 login flow
  }

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  githubAuthCallback(@Req() req: any, @Res() res: any) {
    const token = req.user.access_token;
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/social-callback?token=${token}`,
    );
  }
}
