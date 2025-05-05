import { Inject, Injectable, Logger } from '@nestjs/common';

import { PlayersQueueRequest as PlayersQueueRequest } from '@/players/dto/players-queue.request';
import { DateTimeHelper } from '@/helper/datetime.helper';
import { DungeonService } from '@/dungeon/dungeon.service';
import { PlayersDequeueRequest } from '@/players/dto/players-dequeue.request';
import {
  PlayersProducer,
  PlayersProducerToken,
} from '@/players/interface/players-producer.interface';

@Injectable()
export class PlayersService {
  private readonly logger: Logger = new Logger(PlayersService.name);

  constructor(
    @Inject(PlayersProducerToken)
    private readonly playersProducer: PlayersProducer,
    private readonly dateTimeHelper: DateTimeHelper,
  ) {}

  public async queue(
    request: PlayersQueueRequest,
  ): Promise<{ result: boolean; errorMsg?: string }> {
    const group = { tank: 0, healer: 0, damage: 0 };

    const obj: { result: boolean; errorMsg?: string } = {
      result: true,
    };

    for (const player of request.players) {
      const roles = [...new Set(player.roles)];

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
      }, group);

      const dungeons = [...new Set(request.dungeons)];

      if (!DungeonService.checkPlayerLevel(dungeons, player.level)) {
        obj.result = false;
        obj.errorMsg =
          'one or more players have incorrect level for selected dungeons';

        return obj;
      }

      if (group.tank > 1) {
        obj.result = false;
        obj.errorMsg = 'a group cannot have more than one tank';

        return obj;
      }

      if (group.healer > 1) {
        obj.result = false;
        obj.errorMsg = 'a group cannot have more than one healer';

        return obj;
      }

      if (group.damage > 3) {
        obj.result = false;
        obj.errorMsg = 'a group cannot have more than three damage dealers';

        return obj;
      }
    }

    try {
      const timestamp = this.dateTimeHelper.timestamp();

      const message = {
        ...request,
        queuedAt: timestamp,
      };

      await this.playersProducer.publishQueued(message);

      this.logger.debug(`queued ${JSON.stringify(message)}`);
    } catch (error) {
      this.logger.error(error);

      obj.result = false;
      obj.errorMsg = 'one or more players are already queued';
    }

    return obj;
  }

  public async dequeue(
    request: PlayersDequeueRequest,
  ): Promise<{ result: boolean; errorMsg?: string }> {
    try {
      const timestamp = this.dateTimeHelper.timestamp();

      const message = {
        ...request,
        processedAt: timestamp,
      };

      await this.playersProducer.publishDequeued(message);

      this.logger.debug(`queued ${JSON.stringify(message)}`);

      return { result: true };
    } catch (error) {
      this.logger.error(error);

      return { result: false, errorMsg: JSON.stringify(error) };
    }
  }
}
