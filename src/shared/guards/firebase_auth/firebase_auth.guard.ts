import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  async canActivate(context: ExecutionContext) : Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    this.logger.log('Extracting token from headers');
    const token = this.extractTokenFromHeader(request);

    if(!token) {
      this.logger.log('The extracted token was invalid token');
      throw new UnauthorizedException('No Firebase ID token found');
    }

    this.logger.log('Verifying token');
    const decodedToken = await this.verifyIdToken(token);

    this.logger.log('Valid token, inserting user info to request');
    request.user = decodedToken;
    
    return true;
  }

  private extractTokenFromHeader(request) : string | null {
    const auth = request.headers['authorization'];
    if(auth && auth.startsWith('Bearer ')) {
      return auth.split('Bearer ')[1];
    }
    return null;
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase ID token');
    }
  }

  async getEmailFromToken(idToken: string): Promise<string> {
    const decodedToken = await this.verifyIdToken(idToken);
    return decodedToken.email;
  }
}
