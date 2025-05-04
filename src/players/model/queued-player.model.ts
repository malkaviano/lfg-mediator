import { DungeonName } from '@/dungeon/dungeon-name.literal';
import { PlayerRole } from '@/dungeon/player-role.literal';
import { PlayerStatus } from '@/players/player-status.literal';
import { PlayerLevel } from '@/dungeon/player-level.literal';
import { QueuedPlayerEntity } from '@/players/entity/queued-player.entity';

export class QueuedPlayerModel {
  constructor(
    public id: string,
    public level: PlayerLevel,
    public roles: PlayerRole[],
    public dungeons: DungeonName[],
    public queuedAt: string,
    public status: PlayerStatus,
    public playingWith: string[],
    public groupId?: string,
    public groupedAt?: string,
  ) {}

  public static create(
    queuedPlayerEntity: QueuedPlayerEntity,
  ): QueuedPlayerModel {
    return new QueuedPlayerModel(
      queuedPlayerEntity.id,
      queuedPlayerEntity.level,
      queuedPlayerEntity.roles,
      queuedPlayerEntity.dungeons,
      queuedPlayerEntity.queuedAt,
      'ACCEPTED',
      queuedPlayerEntity.playingWith,
    );
  }
}
