import { PlayersQueueMessage } from '@/players/dto/players-queue.message';
import { PlayersDequeueMessage } from '@/players/dto/players-dequeue.message';

export const PlayersProducerToken = Symbol('PlayersProducer');

export const QueueClientToken = Symbol('QueueClient');

export interface PlayersProducer {
  publishQueued(message: PlayersQueueMessage): Promise<void>;

  publishDequeued(message: PlayersDequeueMessage): Promise<void>;
}
