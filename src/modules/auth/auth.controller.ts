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
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() req: any) {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token", token);
    return this.authService.verifyToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post("refresh-token")
  async renewAccessToken(@Req() req: any) {
    const refreshToken = req.headers.authorization.split(" ")[1];
    return this.authService.refreshToken(refreshToken);
  }

  // Google Auth
  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {
    // Initiates the Google OAuth2 login flow
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthCallback(@Req() req: any, @Res() res: any) {
    const token = req.user.access_token;
    // Redirect to frontend with token
    console.log("req", req);
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/social-callback?token=${token}`;
    console.log("[redirectUrl]", redirectUrl);
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
