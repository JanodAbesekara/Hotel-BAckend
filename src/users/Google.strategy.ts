import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,        // Replace with your Google Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your Google Client Secret
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // Replace with your Google Callback URL
      scope: ['email', 'profile'],                  // Scope for requesting user profile and email
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;

    // Constructing a user object based on Google profile data
    const user = {
      email: emails[0].value,
      firstname: name.givenName,
      lastname: name.familyName,
      AccessToken: accessToken,
    };

    // The done function is provided by Passport to finish the authentication process
    done(null, user);
  }
}
