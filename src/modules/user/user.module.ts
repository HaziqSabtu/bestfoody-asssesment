import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserPrismaRepository } from './repositories/user.prisma.repository';

@Module({
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
