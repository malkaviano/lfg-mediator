import { DungeonGroup } from '@/dungeon/dungeon-group.type';
import { DungeonName } from '@/dungeon/dungeon-name.literal';
import { PlayerRole } from '@/dungeon/player-role.literal';
import { QueuedPlayerEntity } from 'src/players/entity/queued-player.entity';
import { PlayerStatus } from 'src/players/player-status.literal';
import { PlayerGroupMessage } from 'src/players/dto/player-group.message';

export const QueuedPlayersRepositoryToken = Symbol('QueuedPlayersRepository');

export interface QueuedPlayersRepository {
  queue(players: QueuedPlayerEntity[]): Promise<number>;

  get(playerIds: string[]): Promise<QueuedPlayerEntity[]>;

  return(playerIds: string[]): Promise<number>;

  remove(playerIds: string[]): Promise<number>;

  nextInQueue(
    dungeonName: DungeonName,
    playerRole: PlayerRole,
    ignoreIds: string[],
  ): Promise<QueuedPlayerEntity | null>;

  createGroup(group: DungeonGroup, dungeonName: DungeonName): Promise<boolean>;

  groupsToSend(): Promise<PlayerGroupMessage[]>;

  groupsSent(groupIds: string[]): Promise<void>;
}
