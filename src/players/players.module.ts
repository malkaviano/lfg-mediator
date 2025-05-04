import { Module } from '@nestjs/common';

import { PlayersController } from '@/players/players.controller';
import { HelperModule } from '@/helper/helper.module';
import { PlayersService } from '@/players/players.service';

@Module({
  imports: [HelperModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
