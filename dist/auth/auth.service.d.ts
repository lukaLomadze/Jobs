import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignUpCompanyDto } from './dto/sign-up-company.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Model } from 'mongoose';
import { User } from '../users/schema/user.schema';
import { Company } from '../companies/schema/company.schema';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../enum/role.enum';
export declare class AuthService {
    private userModel;
    private companyModel;
    private jwtService;
    constructor(userModel: Model<User>, companyModel: Model<Company>, jwtService: JwtService);
    signUpUser(dto: SignUpUserDto): Promise<{
        message: string;
    }>;
    signUpCompany(dto: SignUpCompanyDto): Promise<{
        message: string;
    }>;
    signIn(dto: SignInDto): Promise<{
        token: string;
        role: Role;
    }>;
    getCurrentUser(userId: string): Promise<any>;
    signInWithGoogle(googleUser: {
        fullName: string;
        email: string;
        profilePic?: string;
    }): Promise<{
        token: string;
        redirectUrl: string;
    }>;
}
