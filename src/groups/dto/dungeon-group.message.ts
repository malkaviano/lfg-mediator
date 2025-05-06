import { DungeonName } from '@/dungeon/dungeon-name.literal';

export type DungeonGroupMessage = {
  readonly groupId: string;
  readonly dungeon: DungeonName;
  readonly tank: string;
  readonly healer: string;
  readonly damage: string[];
};
