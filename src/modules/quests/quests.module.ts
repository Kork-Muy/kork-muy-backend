import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quest } from './entities/quest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quest])],
  controllers: [],
  providers: [],
  exports: [],
})
export class QuestsModule {} 