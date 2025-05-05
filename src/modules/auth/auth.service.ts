import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    };
  }

  async register(userData: Partial<User>) {
    // Check if user already exists
    if (!userData.email) {
      throw new BadRequestException('Email is required');
    }
    const existingUser = await this.usersService.findOne(userData.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }
    // Create new user
    const newUser = await this.usersService.create(userData);
    const { password, ...result } = newUser;
    
    // Generate token
    return this.login(result);
  }

  async handleSocialLogin(profile: any, provider: string) {
    const { id, emails, name, photos } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;
    
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    // Check if user already exists with this social login
    let user = await this.usersService.findBySocialId(provider, id);
    
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
    } else {
      // Create new user
      user = await this.usersService.create({
        email,
        firstName: name?.givenName || name?.familyName ? name.givenName : null,
        lastName: name?.familyName || null,
        avatar: photos && photos.length > 0 ? photos[0].value : null,
        [`${provider}Id`]: id,
        isVerified: true, // Social login users are considered verified
      });
    }
    
    const { password, ...result } = user;
    return this.login(result);
  }
}