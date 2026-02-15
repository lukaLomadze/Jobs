import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignUpCompanyDto } from './dto/sign-up-company.dto';
import { SignInDto } from './dto/sign-in.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schema/user.schema';
import { Company } from '../companies/schema/company.schema';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../enum/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    @InjectModel('company') private companyModel: Model<Company>,
    private jwtService: JwtService,
  ) {}

  async signUpUser(dto: SignUpUserDto) {
    const existUser = await this.userModel.findOne({ email: dto.email });
    if (existUser) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.userModel.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
      role: Role.USER,
    });
    return { message: 'User registered successfully' };
  }

  async signUpCompany(dto: SignUpCompanyDto) {
    const existUser = await this.userModel.findOne({ email: dto.email });
    if (existUser) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
      role: Role.COMPANY,
    });

    await this.companyModel.create({
      name: dto.companyName,
      description: dto.description,
      email: dto.email,
      phone: dto.phone,
      website: dto.website,
      userId: user._id,
      isApproved: false,
    });

    const company = await this.companyModel.findOne({ userId: user._id });
    await this.userModel.findByIdAndUpdate(user._id, {
      companyId: company!._id,
    });

    return { message: 'Company registered. Awaiting admin approval.' };
  }

  async signIn(dto: SignInDto) {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+password');
    if (!user) throw new BadRequestException('Invalid credentials');

    const isPassEqual = await bcrypt.compare(dto.password, user.password);
    if (!isPassEqual) throw new BadRequestException('Invalid credentials');

    const payload = { userId: user._id.toString(), role: user.role };
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { token, role: user.role };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('companyId')
      .lean();
    if (!user) throw new BadRequestException('User not found');
    const { password, ...rest } = user as any;
    return rest;
  }

  async signInWithGoogle(googleUser: {
    fullName: string;
    email: string;
    profilePic?: string;
  }) {
    let user = await this.userModel.findOne({ email: googleUser.email });

    if (!user) {
     
      const randomPassword = Math.random().toString(36).slice(-20) + Date.now().toString();
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await this.userModel.create({
        fullName: googleUser.fullName,
        email: googleUser.email,
        password: hashedPassword,
        role: Role.USER,
      });
    }

   

    const payload = { userId: user._id.toString(), role: user.role };
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });
    const redirectUrl = process.env.FRONT_URL ?? 'http://localhost:3000';

    return { token, redirectUrl };
  }
}
