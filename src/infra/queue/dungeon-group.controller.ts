import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { DungeonGroupMessage } from '@/groups/dto/dungeon-group.message';
import { DungeonGroupsService } from '@/groups/dungeon-groups.service';

@Controller()
export class DungeonGroupController {
  private readonly logger = new Logger(DungeonGroupController.name);

  constructor(private readonly dungeonGroupsService: DungeonGroupsService) {}

  @EventPattern('dungeon-groups')
  async handleDungeonGroup(
    @Payload() data: object[],
    @Ctx() context: RmqContext,
  ) {
    if (this.instanceOfDungeonGroupMessage(data)) {
      this.logger.debug(`Group received: ${JSON.stringify(data)}`);

      await this.dungeonGroupsService.create(data);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    channel.ack(originalMsg);
  }

  private instanceOfDungeonGroupMessage(
    obj: object[],
  ): obj is DungeonGroupMessage[] {
    return (
      Array.isArray(obj) &&
      obj.length > 0 &&
      'groupId' in obj[0] &&
      'dungeon' in obj[0] &&
      'tank' in obj[0] &&
      'healer' in obj[0] &&
      'damage' in obj[0]
    );
  }
}
