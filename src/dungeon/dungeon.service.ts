import { Injectable } from '@nestjs/common';

import { Dungeon } from '@/dungeon/dungeon.definition';
import { DungeonName } from '@/dungeon/dungeon-name.literal';
import { PlayerLevel } from '@/dungeon/player-level.literal';

@Injectable()
export class DungeonService {
  public static readonly Dungeons = new Map<DungeonName, Dungeon>([
    ['RagefireChasm', { name: 'RagefireChasm', minLevel: 17, maxLevel: 24 }],
    ['WailingCaverns', { name: 'WailingCaverns', minLevel: 18, maxLevel: 25 }],
    ['Deadmines', { name: 'Deadmines', minLevel: 20, maxLevel: 28 }],
  ]);

  public static checkPlayerLevel(
    dungeonNames: DungeonName[],
    level: PlayerLevel,
  ): boolean {
    let result = true;

    dungeonNames.forEach((dungeonName) => {
      const dungeon = this.Dungeons.get(dungeonName);

      if (!dungeon) {
        throw new Error(`Dungeon not found: ${dungeonName}`);
      }

      const minLevel = dungeon.minLevel;

      const maxLevel = dungeon.maxLevel;

      result = result && minLevel <= level && maxLevel >= level;
    });

    return result;
  }
}
