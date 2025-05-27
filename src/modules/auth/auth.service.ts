import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./users.service";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserAuth } from "./entities/user-auth.entity";
import { Repository } from "typeorm";
import { Request, Response } from "express";
import { UserDto } from "src/shared/dto/use.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any, provider?: string, res?: Response) {
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, { expiresIn: "1h" });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: "7d" });

    const userAuth = this.userAuthRepository.create({
      userId: user.id,
      accessToken: access_token,
      refreshToken: refresh_token,
      accessTokenExpiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
      refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      provider: provider || "local",
      createdAt: new Date(),
    });
    await this.userAuthRepository.save(userAuth);

   

    if(res) {
      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60, // 1hour
      });
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        avatar: user.avatar,
      },
    };
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return { message: "Logged out successfully" };
  }

  async register(userData: Partial<User>) {
    // Check if user already exists
    if (!userData.email) {
      throw new BadRequestException("Email is required");
    }

    const existingUser = await this.usersService.findOne(userData.email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }
    // Create new user
    const newUser = await this.usersService.create(userData);
    const { password, ...result } = newUser;

    // Generate token
    return this.login(result);
  }

  async handleSocialLogin(profile: any, provider: string, res?: any) {
    const { id, email, firstName, lastName, avatar } = profile;

    console.log("social login", profile);
    

    if (!email) {
      throw new BadRequestException("Email is required");
    }

    // Check if user already exists with this social login
    let user = await this.usersService.findBySocialId(provider, id);
    console.log("handleSocialLogin User", user);

    // Check if user exists with this email
    if (!user) {
      user = await this.usersService.findOne(email);
    }

    if (user) {
      // Update user with social login info if not already set
      if (!user[`${provider}Id` as keyof User]) {
        user = await this.usersService.update(user.id, {
          [`${provider}Id`]: id,
        });
      }
      user.firstName = firstName;
      user.lastName = lastName;
      user.avatar = avatar;
      await this.usersService.update(user.id, user);
    } else {
      // Create new user
      user = await this.usersService.create({
        email: email,
        firstName: firstName,
        lastName: lastName,
        avatar: avatar,
        [`${provider}Id`]: id,
        isVerified: true, // Social login users are considered verified
      });
    }

    const { password, ...result } = user;
    return this.login(result, provider, res);
  }

  async verifyToken(token: string) {
    console.log("token", token);
    const decoded = this.jwtService.verify(token);
    console.log("decoded", decoded);
    const userAuth = await this.userAuthRepository.findOne({
      where: {
        accessToken: token,
      },
    });
    if (!userAuth) {
      throw new UnauthorizedException("Invalid token");
    }
    const user = await this.usersService.findById(userAuth.userId);
    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }
    if (userAuth.accessTokenExpiresAt < new Date()) {
      if (userAuth.refreshTokenExpiresAt < new Date()) {
        throw new UnauthorizedException("Token expired");
      }
    }
    return {
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        avatar: user.avatar,
      }
    };
  }

  async refreshToken(req: Request, res: Response) {

    console.log("refreshToken", req.cookies);

    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException("Invalid token");
    }

    const decoded = this.jwtService.verify(refreshToken);
    console.log("decoded", decoded);
    const userAuth = await this.userAuthRepository.findOne({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!userAuth) {
      throw new UnauthorizedException("Invalid token");
    }
    const user = await this.usersService.findById(userAuth.userId);

    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }
    const newAccessToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: "1h" },
    );
    userAuth.accessToken = newAccessToken;
    userAuth.accessTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    await this.userAuthRepository.save(userAuth);

    if(res) {
      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60, // 1hour
      });
    }
    console.log("newAccessToken", res);

    return res.json({ user: new UserDto(user) })
  }
}
