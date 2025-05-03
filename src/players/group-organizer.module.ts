import { Module } from '@nestjs/common';

import { PlayersController } from '@/players/players.controller';
import { HelperModule } from '@/helper/helper.module';

@Module({
  imports: [HelperModule],
  controllers: [PlayersController],
  providers: [],
})
export class GroupOrganizerModule {}
