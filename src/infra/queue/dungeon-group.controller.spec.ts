import { Test, TestingModule } from '@nestjs/testing';
import { RmqContext } from '@nestjs/microservices';

import { mock } from 'ts-jest-mocker';

import { DungeonGroupController } from '@/infra/queue/dungeon-group.controller';
import { DungeonGroupMessage } from '@/players/dto/dungeon-group.message';

describe('DungeonGroupController', () => {
  let controller: DungeonGroupController;

  const mockedRabbitMQContext = mock(RmqContext);

  // const timestamp = '2025-04-01T11:42:19.088Z';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DungeonGroupController],
      providers: [],
    }).compile();

    controller = module.get<DungeonGroupController>(DungeonGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleDungeonGroup', () => {
    it('queue players and ack', async () => {
      let result = false;

      // mockedGroupQueueingService.queue.mockResolvedValueOnce({ result: true });

      mockedRabbitMQContext.getChannelRef.mockImplementationOnce(() => ({
        ack: () => (result = true),
      }));

      const message: DungeonGroupMessage = {
        groupId: 'group1',
        damage: ['dmg1', 'dmg2', 'dmg3'],
        tank: 'tank1',
        healer: 'healer1',
        dungeon: 'Deadmines',
      };

      mockedRabbitMQContext.getMessage.mockImplementationOnce(() => ({
        data: message,
      }));

      await controller.handleDungeonGroup(message, mockedRabbitMQContext);

      // expect(mockedGroupQueueingService.queue).toHaveBeenCalledWith(message);

      expect(result).toEqual(true);
    });
  });
});
