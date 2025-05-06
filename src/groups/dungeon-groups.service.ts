import { Inject, Injectable } from '@nestjs/common';

import {
  DungeonGroupsRepository,
  DungeonGroupsRepositoryToken,
} from '@/groups/interface/dungeon-groups-repository.interface';
import { DungeonGroupMessage } from '@/groups/dto/dungeon-group.message';

@Injectable()
export class DungeonGroupsService {
  constructor(
    @Inject(DungeonGroupsRepositoryToken)
    private readonly dungeonGroupsRepository: DungeonGroupsRepository,
  ) {}

  async create(groups: DungeonGroupMessage[]): Promise<number> {
    return this.dungeonGroupsRepository.create(groups);
  }
}
