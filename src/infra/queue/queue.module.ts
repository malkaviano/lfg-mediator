import { ClientsModule, RmqOptions } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { QueueClientToken } from '@/players/interface/players-producer.interface';

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
  controllers: [],
  providers: [],
})
export class QueueModule {}
