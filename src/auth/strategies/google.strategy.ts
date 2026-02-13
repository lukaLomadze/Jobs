import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      callbackURL: process.env.GOOGLE_REDIRECT_URI!,
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ['profile', 'email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void,
  ) {
    const user = {
      fullName: profile.displayName || profile.name?.givenName + ' ' + profile.name?.familyName,
      email: profile.emails?.[0]?.value || profile.email,
      profilePic: profile.photos?.[0]?.value || profile.picture,
    };
    done(null, user);
  }
}
