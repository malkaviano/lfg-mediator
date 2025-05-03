import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';

import { mock } from 'ts-jest-mocker';

import { PlayersController } from '@/players/players.controller';
import { GroupQueueRequest } from '@/players/dto/group-queue.request';
import { GroupDequeueRequest } from '@/players/dto/group-dequeue.request';

describe('PlayersController', () => {
  let controller: PlayersController;

  const mockedGroupOrganizerService = mock(GroupQueueingService);

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: GroupQueueingService,
          useValue: mockedGroupOrganizerService,
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('queue', () => {
    it('queue players', async () => {
      const body: GroupQueueRequest = {
        players: [
          {
            id: 'id1',
            level: 20,
            roles: ['Tank', 'Damage'],
          },
          {
            id: 'id2',
            level: 20,
            roles: ['Damage'],
          },
        ],
        dungeons: ['Deadmines'],
      };

      mockedGroupOrganizerService.queue.mockResolvedValueOnce({
        result: true,
      });

      await controller.queue(body);

      expect(mockedGroupOrganizerService.queue).toHaveBeenCalled();
    });

    describe('when service fails', () => {
      it('throw HttpException', async () => {
        const body: GroupQueueRequest = {
          players: [
            {
              id: 'id1',
              level: 15,
              roles: ['Tank', 'Damage'],
            },
          ],
          dungeons: ['Deadmines'],
        };

        mockedGroupOrganizerService.queue.mockResolvedValue({
          result: false,
          errorMsg: 'Player cannot be queued',
        });

        await expect(controller.queue(body)).rejects.toThrow(
          'Player cannot be queued',
        );

        await expect(controller.queue(body)).rejects.toThrow(HttpException);
      });
    });
  });

  describe('dequeue', () => {
    it('remove players from queue', async () => {
      const body: GroupDequeueRequest = {
        playerIds: ['id1', 'id2'],
      };

      mockedGroupOrganizerService.dequeue.mockResolvedValueOnce(2);

      await controller.dequeue(body);

      expect(mockedGroupOrganizerService.dequeue).toHaveBeenCalled();
    });
  });
});
