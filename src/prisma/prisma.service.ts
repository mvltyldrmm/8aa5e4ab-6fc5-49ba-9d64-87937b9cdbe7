import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  [x: string]: any;
  async enableShutDownHooks(app: INestApplication) {
    this.process.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
