import { VerificationTokenTypes } from '../verification-token.entity';

export class CreateVerificationTokenDto {
  userId: string;
  type?: VerificationTokenTypes;
  token?: string;
  expiresAt?: Date | string;
}
