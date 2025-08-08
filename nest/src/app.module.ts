import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { auth } from './auth';
import { AuthModule } from '@thallesp/nestjs-better-auth';

@Module({
  imports: [AuthModule.forRoot(auth)],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
