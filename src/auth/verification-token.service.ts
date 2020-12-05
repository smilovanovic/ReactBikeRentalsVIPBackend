import { Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { VerificationTokenRepository } from './verification-token.repository';
import { VerificationToken } from './verification-token.entity';
import { MoreThanOrEqual } from 'typeorm';
import { CreateVerificationTokenDto } from './dto/create-verification-token.dto';

@Injectable()
export class VerificationTokenService {
  private defaultConditions: FindConditions<VerificationToken> = {
    isUsed: false,
  };
  constructor(
    private verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async findOne(token: string): Promise<VerificationToken | undefined> {
    return this.verificationTokenRepository.findOne({
      ...this.defaultConditions,
      token,
      expiresAt: MoreThanOrEqual(new Date()),
    });
  }

  async create(
    createTokenDto: CreateVerificationTokenDto,
    entityManager?: EntityManager,
  ): Promise<VerificationToken> {
    const token = this.verificationTokenRepository.create(createTokenDto);
    return this.getRepository(entityManager).save(token);
  }

  private getRepository(entityManager?: EntityManager) {
    return entityManager
      ? entityManager.getCustomRepository(VerificationTokenRepository)
      : this.verificationTokenRepository;
  }
}
