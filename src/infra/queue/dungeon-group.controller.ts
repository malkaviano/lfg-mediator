import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class DungeonGroupController {
  private readonly logger = new Logger(DungeonGroupController.name);

  constructor() {}

  @EventPattern('dungeon-groups')
  handleDungeonGroup(@Payload() data: unknown, @Ctx() context: RmqContext) {
    this.logger.debug(`Group received: ${JSON.stringify(data)}`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    channel.ack(originalMsg);
  }
}
