import { Inject, Injectable, Logger } from '@nestjs/common';

import { PlayersQueueRequest as PlayersQueueRequest } from '@/players/dto/players-queue.request';
import { QueuedPlayerEntity } from '@/players/entity/queued-player.entity';
import { DateTimeHelper } from '@/helper/datetime.helper';
import { DungeonService } from '@/dungeon/dungeon.service';
import { PlayersDequeueRequest } from '@/players/dto/players-dequeue.request';
import {
  QueuedPlayersRepository,
  QueuedPlayersRepositoryToken,
} from '@/players/interface/queued-players-repository.interface';
import { PlayersQueueMessage } from '@/players/dto/players-queue.message';

@Injectable()
export class PlayersService {
  private readonly logger: Logger = new Logger(PlayersService.name);

  constructor(
    @Inject(QueuedPlayersRepositoryToken)
    private readonly queuePlayersRepository: QueuedPlayersRepository,
    private readonly dateTimeHelper: DateTimeHelper,
  ) {}

  public async queue(
    request: PlayersQueueRequest | PlayersQueueMessage,
  ): Promise<{ result: boolean; errorMsg?: string }> {
    const timestamp = this.dateTimeHelper.timestamp();

    const party = { tank: 0, healer: 0, damage: 0 };

    const obj: { result: boolean; errorMsg?: string } = {
      result: true,
    };

    const playerIds = request.players.map((p) => p.id);

    const players = request.players.map((p) => {
      const roles = [...new Set(p.roles)];

      roles.reduce((acc, role) => {
        switch (role) {
          case 'Damage':
            acc.damage += 1;
            break;
          case 'Healer':
            acc.healer += 1;
            break;
          case 'Tank':
            acc.tank += 1;
            break;
        }

        return acc;
      }, party);

      const dungeons = [...new Set(request.dungeons)];

      if (!DungeonService.checkPlayerLevel(dungeons, p.level)) {
        obj.result = false;
        obj.errorMsg =
          'one or more players have incorrect level for selected dungeons';
      }

      const entity = new QueuedPlayerEntity(
        p.id,
        p.level,
        roles,
        dungeons,
        timestamp,
        playerIds.filter((id) => id !== p.id),
      );

      return entity;
    });

    if (party.tank > 1) {
      obj.result = false;
      obj.errorMsg = 'a group cannot have more than one tank';
    } else if (party.healer > 1) {
      obj.result = false;
      obj.errorMsg = 'a group cannot have more than one healer';
    } else if (party.damage > 3) {
      obj.result = false;
      obj.errorMsg = 'a group cannot have more than three damage dealers';
    }

    if (!obj.result) {
      return obj;
    }

    try {
      await this.queuePlayersRepository.queue(players);

      this.logger.debug(`queued ${JSON.stringify(players)}`);
    } catch (error) {
      this.logger.error(error);

      obj.result = false;
      obj.errorMsg = 'one or more players are already queued';
    }

    return obj;
  }

  public async dequeue(request: PlayersDequeueRequest): Promise<number> {
    const { playerIds } = request;

    return this.queuePlayersRepository.dequeue(playerIds);
  }
}
