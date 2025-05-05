import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
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
  implements PlayersProducer, OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger: Logger = new Logger(PlayersProducerService.name);

  constructor(@Inject(QueueClientToken) private readonly client: ClientProxy) {}

  async onApplicationBootstrap() {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw error;
    }
  }

  async onApplicationShutdown() {
    try {
      await this.client.close();
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw error;
    }
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
