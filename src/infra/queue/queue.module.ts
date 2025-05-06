import { ClientsModule, RmqOptions } from '@nestjs/microservices';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PlayersProducerService } from '@/infra/queue/players-producer.service';
import { DungeonGroupController } from '@/infra/queue/dungeon-group.controller';
import { GroupsModule } from '@/groups/groups.module';
import { PlayerProducerProxyToken, PlayersProducerToken } from '../../tokens';

@Global()
@Module({
  imports: [
    GroupsModule,
    ClientsModule.registerAsync([
      {
        name: PlayerProducerProxyToken,
        useFactory: (configService: ConfigService) =>
          configService.get<RmqOptions>('rmqPlayersOptions')!,
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
