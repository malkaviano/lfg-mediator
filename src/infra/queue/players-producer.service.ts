import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';

import {
  PlayersProducer,
  QueueClientToken,
} from '@/players/interface/players-producer.interface';
import { PlayersQueueMessage } from '@/players/dto/players-queue.message';
import { PlayersDequeueMessage } from '@/players/dto/players-dequeue.message';

@Injectable()
export class PlayersProducerService
  implements PlayersProducer, OnApplicationBootstrap
{
  constructor(@Inject(QueueClientToken) private readonly client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async publishQueued(message: PlayersQueueMessage): Promise<void> {
    await lastValueFrom(
      this.client.emit<PlayersQueueMessage>('players-queued', message),
    );
  }

  async publishDequeued(message: PlayersDequeueMessage): Promise<void> {
    await lastValueFrom(
      this.client.emit<PlayersQueueMessage>('players-dequeued', message),
    );
  }
}
