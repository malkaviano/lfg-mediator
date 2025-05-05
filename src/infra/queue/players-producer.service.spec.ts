import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';

import { mock } from 'ts-jest-mocker';
import { of } from 'rxjs';

import { PlayersProducerService } from '@/infra/queue/players-producer.service';
import { QueueClientToken } from '@/players/interface/players-producer.interface';
import { PlayersQueueMessage } from '@/players/dto/players-queue.message';
import { PlayersDequeueMessage } from '@/players/dto/players-dequeue.message';

describe('PlayersProducerService', () => {
  let service: PlayersProducerService;

  const mockedRmqClient = mock<ClientProxy>();

  const timestamp = '2025-04-01T11:42:19.088Z';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersProducerService,
        { provide: QueueClientToken, useValue: mockedRmqClient },
      ],
    }).compile();

    service = module.get<PlayersProducerService>(PlayersProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publishQueued', () => {
    it('should call the client emit method with the correct parameters', async () => {
      const message: PlayersQueueMessage = {
        players: [
          {
            id: 'id1',
            level: 23,
            roles: ['Damage', 'Healer'],
          },
        ],
        dungeons: ['Deadmines', 'RagefireChasm'],
        queuedAt: timestamp,
      };

      mockedRmqClient.emit.mockReturnValueOnce(of(message));

      await service.publishQueued(message);

      expect(mockedRmqClient.emit).toHaveBeenCalledWith(
        'players-queued',
        message,
      );
    });
  });

  describe('publishDequeued', () => {
    it('should call the client emit method with the correct parameters', async () => {
      const message: PlayersDequeueMessage = {
        playerIds: ['id1', 'id2'],
        processedAt: timestamp,
      };

      mockedRmqClient.emit.mockReturnValueOnce(of(message));

      await service.publishDequeued(message);

      expect(mockedRmqClient.emit).toHaveBeenCalledWith(
        'players-dequeued',
        message,
      );
    });
  });
});
