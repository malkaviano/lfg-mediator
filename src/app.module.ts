import { Module } from '@nestjs/common';

import { DungeonModule } from '@/dungeon/dungeon.module';

@Module({
  imports: [DungeonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
