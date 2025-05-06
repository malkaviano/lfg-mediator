import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Db, MongoClient } from 'mongodb';

import { DungeonGroupsRepository } from '@/groups/interface/dungeon-groups-repository.interface';
import { DateTimeHelper } from '@/helper/datetime.helper';
import { DungeonGroupMessage } from '@/groups/dto/dungeon-group.message';
import { DungeonGroupModel } from '@/groups/model/dungeon-group.model';
import { MONGODB_DRIVER_OBJECT } from '../../tokens';

import mongoCollections from '@/config/mongo-collection.config';

@Injectable()
export class MongoDungeonGroupsRepository implements DungeonGroupsRepository {
  constructor(
    @Inject(MONGODB_DRIVER_OBJECT)
    private readonly mongoObject: { client: MongoClient; db: Db },
    private readonly datetimeHelper: DateTimeHelper,
    @Inject(mongoCollections.KEY)
    private readonly collections: ConfigType<typeof mongoCollections>,
  ) {}

  async create(groups: DungeonGroupMessage[]): Promise<number> {
    const models = groups.map((group) => {
      return new DungeonGroupModel(
        group.groupId,
        group.dungeon,
        group.tank,
        group.healer,
        group.damage,
      );
    });

    const inserted = await this.mongoObject.db
      .collection(this.collections.dungeonGroups)
      .insertMany(models);

    return inserted.insertedCount;
  }

  async remove(groupIds: string[]): Promise<number> {
    const deleted = await this.mongoObject.db
      .collection(this.collections.dungeonGroups)
      .deleteMany({
        groupId: { $in: groupIds },
      });

    return deleted.deletedCount;
  }
}
