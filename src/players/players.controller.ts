import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { PlayersQueueRequest } from '@/players/dto/players-queue.request';
import { PlayersService } from '@/players/players.service';
import { PlayersDequeueRequest } from '@/players/dto/players-dequeue.request';

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

  @Post('dequeue')
  @HttpCode(204)
  public async dequeue(@Body() request: PlayersDequeueRequest): Promise<void> {
    const { result, errorMsg = 'unknown error' } =
      await this.playersService.dequeue(request);

    if (!result) {
      throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
    }
  }
}
