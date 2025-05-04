import { QueuedPlayerEntity } from '@/players/entity/queued-player.entity';

export const QueuedPlayersRepositoryToken = Symbol('QueuedPlayersRepository');

export interface QueuedPlayersRepository {
  queue(players: QueuedPlayerEntity[]): Promise<number>;

  dequeue(playerIds: string[]): Promise<number>;
}
