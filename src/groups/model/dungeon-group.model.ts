import { DungeonName } from '@/dungeon/dungeon-name.literal';

export class DungeonGroupModel {
  constructor(
    public groupId: string,
    public dungeon: DungeonName,
    public tank: string,
    public healer: string,
    public damage: string[],
    public confirmedIds: string[] = [],
    public deniedIds: string[] = [],
    public askAt?: string,
    public deadline?: string,
  ) {}
}
