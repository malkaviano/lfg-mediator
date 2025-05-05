import { PlayersDequeueRequest } from '@/players/dto/players-dequeue.request';

export interface PlayersDequeueMessage extends PlayersDequeueRequest {
  readonly processedAt: string;
}
