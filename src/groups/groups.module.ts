import { Module } from '@nestjs/common';

import { HelperModule } from '@/helper/helper.module';
import { DungeonGroupsRepositoryToken } from '@/groups/interface/dungeon-groups-repository.interface';
import { MongoDungeonGroupsRepository } from '@/infra/mongo/dungeon-groups.repository';
import { DungeonGroupsService } from '@/groups/dungeon-groups.service';

@Module({
  imports: [HelperModule],
  providers: [
    {
      provide: DungeonGroupsRepositoryToken,
      useClass: MongoDungeonGroupsRepository,
    },
    DungeonGroupsService,
  ],
  exports: [DungeonGroupsService],
})
export class GroupsModule {}
