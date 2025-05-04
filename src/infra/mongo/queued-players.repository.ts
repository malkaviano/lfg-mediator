import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Db, MongoClient, PullOperator } from 'mongodb';

import { QueuedPlayerEntity } from '@/players/entity/queued-player.entity';
import { QueuedPlayerModel } from '@/players/model/queued-player.model';
import { DungeonName } from '@/dungeon/dungeon-name.literal';
import { PlayerRole } from '@/dungeon/player-role.literal';
import { QueuedPlayersRepository } from '@/players/interface/queued-players-repository.interface';
import { DateTimeHelper } from '@/helper/datetime.helper';
import { IdHelper } from '@/helper/id.helper';
import mongodbCollection from '@/config/mongo-collection.config';
import { PlayerLevel } from '@/dungeon/player-level.literal';
import { MONGODB_DRIVER_OBJECT } from '../../tokens';

@Injectable()
export class MongoQueuedPlayersRepository implements QueuedPlayersRepository {
  constructor(
    @Inject(MONGODB_DRIVER_OBJECT)
    private readonly mongoObject: { client: MongoClient; db: Db },
    private readonly datetimeHelper: DateTimeHelper,
    private readonly idHelper: IdHelper,
    @Inject(mongodbCollection.KEY)
    private readonly mongoCollections: ConfigType<typeof mongodbCollection>,
  ) {}

  public async queue(players: QueuedPlayerEntity[]): Promise<number> {
    const results = players.map((player) => {
      const playerModel = QueuedPlayerModel.create(player);

      return { playerId: player.id, playerModel };
    });

    const found = await this.get(results.map((r) => r.playerId));

    if (found.length) {
      throw new Error('Player already queued');
    }

    const result = await this.mongoObject.db
      .collection(this.mongoCollections.queuedPlayers)
      .insertMany(results.map((r) => r.playerModel));

    return result.insertedCount;
  }

  public async get(playerIds: string[]): Promise<QueuedPlayerEntity[]> {
    const result = this.mongoObject.db
      .collection(this.mongoCollections.queuedPlayers)
      .find({ id: { $in: playerIds } });

    return result
      .map((document) => {
        return new QueuedPlayerEntity(
          document.id as string,
          document.level as PlayerLevel,
          document.roles as PlayerRole[],
          document.dungeons as DungeonName[],
          document.queuedAt as string,
          document.playingWith as string[],
        );
      })
      .toArray();
  }

  public async dequeue(playerIds: string[]): Promise<number> {
    const deleted = await this.get(playerIds);

    const deletedIds = deleted.map((d) => d.id);

    const linked = deleted
      .flatMap((p) => p.playingWith)
      .filter((id) => deletedIds.some((d) => d !== id));

    const pull = { playingWith: { $in: deletedIds } } as PullOperator<Document>;

    await this.mongoObject.db
      .collection(this.mongoCollections.queuedPlayers)
      .updateMany(
        { id: { $in: linked } },
        {
          $pull: pull,
        },
      );

    const result = await this.mongoObject.db
      .collection(this.mongoCollections.queuedPlayers)
      .deleteMany({ id: { $in: playerIds } });

    return result.deletedCount ?? 0;
  }
}
