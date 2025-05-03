import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { GroupQueueRequest } from '@/players/dto/group-queue.request';
import { GroupDequeueRequest } from '@/players/dto/group-dequeue.request';

@Controller('players')
export class PlayersController {
  constructor(private readonly groupOrganizerService: GroupQueueingService) {}

  @Post('queue')
  public async queue(@Body() request: GroupQueueRequest): Promise<void> {
    const { result, errorMsg = 'unknown error' } =
      await this.groupOrganizerService.queue(request);

    if (!result) {
      throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('remove')
  @HttpCode(200)
  public async dequeue(@Body() request: GroupDequeueRequest): Promise<void> {
    await this.groupOrganizerService.dequeue(request);
  }
}
