import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaService } from '../../shared/services/prisma.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
    });

    if (!data) {
      return null;
    }

    return new User(data);
  }
}
