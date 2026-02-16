import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignUpCompanyDto } from './dto/sign-up-company.dto';
import { SignInDto } from './dto/sign-in.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUpUser(dto: SignUpUserDto): Promise<{
        message: string;
    }>;
    signUpCompany(dto: SignUpCompanyDto): Promise<{
        message: string;
    }>;
    signIn(dto: SignInDto): Promise<{
        token: string;
        role: import("../enum/role.enum").Role;
    }>;
    signInWithGoogle(): void;
    googleAuthCallback(req: any, res: any): Promise<void>;
    currentUser(userId: string): Promise<any>;
}
