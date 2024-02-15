import { NullToUndefinedMiddleware } from './shared/undefined-creator';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './shared/prisma-client-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { StoresModule } from './stores/stores.module';
import { BooksModule } from './books/books.module';
@Module({
  imports: [PrismaModule, UsersModule, AuthModule, StoresModule, BooksModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(NullToUndefinedMiddleware).forRoutes('*');
  }
}
