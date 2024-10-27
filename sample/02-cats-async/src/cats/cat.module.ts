import { Module } from '@nestjs/common';
import { ExpressCassandraModule } from '@quocanhbk17/express-cassandra';
import { CatsController } from './cat.controller';
import { CatsService } from './cat.service';
import { CatEntity } from './entities/cat.entity';

@Module({
  imports: [ExpressCassandraModule.forFeature([CatEntity])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
