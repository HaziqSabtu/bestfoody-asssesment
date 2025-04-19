import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';

import { PrismaService } from './services/prisma.service';
import { CloudService } from './services/cloud.service';

const providers: Provider[] = [PrismaService, CloudService];

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
