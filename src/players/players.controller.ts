import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { PlayersQueueRequest } from '@/players/dto/players-queue.request';
import { PlayersDequeueRequest } from '@/players/dto/players-dequeue.request';
import { PlayersService } from '@/players/players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post('queue')
  public async queue(@Body() request: PlayersQueueRequest): Promise<void> {
    const { result, errorMsg = 'unknown error' } =
      await this.playersService.queue(request);

    if (!result) {
      throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('remove')
  @HttpCode(204)
  public async dequeue(@Body() request: PlayersDequeueRequest): Promise<void> {
    await this.playersService.dequeue(request);
  }
}
