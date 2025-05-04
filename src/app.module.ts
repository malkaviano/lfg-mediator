import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DungeonModule } from '@/dungeon/dungeon.module';
import { PlayersModule } from '@/players/players.module';
import { MongodbModule } from '@/infra/mongo/mongodb.module';

import mongoConnection from '@/config/mongo-connection.config';
import mongoCollection from '@/config/mongo-collection.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConnection, mongoCollection],
    }),
    DungeonModule,
    PlayersModule,
    MongodbModule.forRootAsync({
      useFactory(config: ConfigService) {
        const values = config.get('mongoConnection') as {
          url: string;
          dbName: string;
        };

        return Promise.resolve({
          url: values.url,
          dbName: values.dbName,
        });
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
