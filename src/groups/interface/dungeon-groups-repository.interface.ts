import { DungeonGroupMessage } from '@/groups/dto/dungeon-group.message';

export const DungeonGroupsRepositoryToken = Symbol('DungeonGroupsRepository');

export interface DungeonGroupsRepository {
  create(groups: DungeonGroupMessage[]): Promise<number>;

  remove(groupIds: string[]): Promise<number>;
}
