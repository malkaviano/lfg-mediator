import { Test, TestingModule } from '@nestjs/testing';

import { mock } from 'ts-jest-mocker';

import { PlayersQueueRequest } from '@/players/dto/players-queue.request';
import { DateTimeHelper } from '@/helper/datetime.helper';
import { PlayerLevel } from '@/dungeon/player-level.literal';
import { PlayerRole } from '@/dungeon/player-role.literal';
import { DungeonName } from '@/dungeon/dungeon-name.literal';
import { PlayersService } from '@/players/players.service';
import { PlayersProducer } from '@/players/interface/players-producer.interface';
import { PlayersDequeueMessage } from '@/players/dto/players-dequeue.message';
import { PlayersProducerToken } from '../tokens';

describe('PlayersService', () => {
  let service: PlayersService;

  const mockedPlayersProducer = mock<PlayersProducer>();

  const mockedDateTimeHelper = mock(DateTimeHelper);

  const timestamp = '2025-04-01T11:42:19.088Z';

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: PlayersProducerToken,
          useValue: mockedPlayersProducer,
        },
        {
          provide: DateTimeHelper,
          useValue: mockedDateTimeHelper,
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('queue', () => {
    it('sanitize values and queue', async () => {
      const body: PlayersQueueRequest = {
        players: [
          {
            id: 'id1',
            level: 20,
            roles: ['Tank', 'Damage', 'Damage'],
          },
          {
            id: 'id2',
            level: 21,
            roles: ['Healer', 'Healer'],
          },
        ],
        dungeons: ['RagefireChasm', 'Deadmines', 'RagefireChasm', 'Deadmines'],
      };

      mockedDateTimeHelper.timestamp.mockReturnValueOnce(timestamp);

      mockedPlayersProducer.publishQueued.mockResolvedValueOnce();

      const result = await service.queue(body);

      expect(result).toEqual({ result: true });

      const message = {
        ...body,
        queuedAt: timestamp,
      };

      expect(mockedPlayersProducer.publishQueued).toHaveBeenCalledWith(message);
    });

    it('validate player level', async () => {
      const body: PlayersQueueRequest = {
        players: [
          {
            id: 'id1',
            level: 15,
            roles: ['Tank', 'Damage'],
          },
          {
            id: 'id2',
            level: 21,
            roles: ['Healer'],
          },
        ],
        dungeons: ['RagefireChasm', 'Deadmines'],
      };

      mockedDateTimeHelper.timestamp.mockReturnValueOnce(timestamp);

      const result = await service.queue(body);

      expect(result).toEqual({
        result: false,
        errorMsg:
          'one or more players have incorrect level for selected dungeons',
      });
    });

    [
      {
        players: [
          {
            id: 'id1',
            level: 20 as PlayerLevel,
            roles: ['Tank', 'Damage'] as PlayerRole[],
          },
          {
            id: 'id2',
            level: 20 as PlayerLevel,
            roles: ['Tank', 'Healer', 'Damage'] as PlayerRole[],
          },
        ],
        dungeons: ['Deadmines'] as DungeonName[],
        expected: {
          result: false,
          errorMsg: 'a group cannot have more than one tank',
        },
      },
      {
        players: [
          {
            id: 'id1',
            level: 20 as PlayerLevel,
            roles: ['Healer'] as PlayerRole[],
          },
          {
            id: 'id2',
            level: 20 as PlayerLevel,
            roles: ['Tank', 'Healer', 'Damage'] as PlayerRole[],
          },
        ],
        dungeons: ['Deadmines'] as DungeonName[],
        expected: {
          result: false,
          errorMsg: 'a group cannot have more than one healer',
        },
      },
      {
        players: [
          {
            id: 'id1',
            level: 20 as PlayerLevel,
            roles: ['Damage'] as PlayerRole[],
          },
          {
            id: 'id2',
            level: 20 as PlayerLevel,
            roles: ['Tank', 'Healer', 'Damage'] as PlayerRole[],
          },
          {
            id: 'id3',
            level: 20 as PlayerLevel,
            roles: ['Damage'] as PlayerRole[],
          },
          {
            id: 'id4',
            level: 20 as PlayerLevel,
            roles: ['Damage'] as PlayerRole[],
          },
        ],
        dungeons: ['Deadmines'] as DungeonName[],
        expected: {
          result: false,
          errorMsg: 'a group cannot have more than three damage dealers',
        },
      },
    ].forEach(({ players, dungeons, expected }) => {
      it('validate roles', async () => {
        mockedDateTimeHelper.timestamp.mockReturnValueOnce(timestamp);

        const result = await service.queue({ players, dungeons });

        expect(result).toEqual(expected);
      });
    });
  });

  describe('dequeue', () => {
    it('remove waiting players', async () => {
      const message: PlayersDequeueMessage = {
        playerIds: ['id1', 'id2'],
        processedAt: timestamp,
      };

      mockedDateTimeHelper.timestamp.mockReturnValueOnce(timestamp);

      mockedPlayersProducer.publishDequeued.mockResolvedValueOnce();

      const result = await service.dequeue(message);

      expect(result).toEqual({ result: true });

      expect(mockedPlayersProducer.publishDequeued).toHaveBeenCalledWith(
        message,
      );
    });

    describe('when an error occur', () => {
      it('return false with error message', async () => {
        const message: PlayersDequeueMessage = {
          playerIds: ['id1', 'id2'],
          processedAt: timestamp,
        };

        mockedDateTimeHelper.timestamp.mockReturnValueOnce(timestamp);

        mockedPlayersProducer.publishDequeued.mockRejectedValueOnce(
          'Unexpected',
        );

        const result = await service.dequeue(message);

        expect(result).toEqual({ result: false, errorMsg: '"Unexpected"' });
      });
    });
  });
});
