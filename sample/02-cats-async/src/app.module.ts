import { Module } from '@nestjs/common';
import { ExpressCassandraModule } from '@quocanhbk17/express-cassandra';
import { AppService } from './app.service';
import { CatsModule } from './cats';
import { CatEntity } from './cats/entities/cat.entity';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ExpressCassandraModule.forRootAsync({
      useClass: ConfigService,
    }),
    ExpressCassandraModule.forRootAsync({
      name: 'test2',
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.getDbConfig2(),
      inject: [ConfigService],
    }),
    ExpressCassandraModule.forFeature([CatEntity], 'test2'),
    CatsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
