import { DungeonName } from '@/dungeon/dungeon-name.literal';

export class DungeonGroupMessage {
  constructor(
    public readonly groupId: string,
    public readonly dungeon: DungeonName,
    public readonly tank: string,
    public readonly healer: string,
    public readonly damage: string[],
  ) {}
}
