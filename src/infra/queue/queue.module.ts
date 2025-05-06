import { ClientsModule, RmqOptions } from '@nestjs/microservices';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  PlayersProducerToken,
  QueueClientToken,
} from '@/players/interface/players-producer.interface';
import { PlayersProducerService } from '@/infra/queue/players-producer.service';
import { DungeonGroupController } from '@/infra/queue/dungeon-group.controller';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: QueueClientToken,
        useFactory: (configService: ConfigService) =>
          configService.get<RmqOptions>('rmqOptions')!,
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [DungeonGroupController],
  providers: [
    {
      provide: PlayersProducerToken,
      useClass: PlayersProducerService,
    },
  ],
  exports: [
    {
      provide: PlayersProducerToken,
      useClass: PlayersProducerService,
    },
  ],
})
export class QueueModule {}
