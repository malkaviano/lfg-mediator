import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { v4 as uuidv4 } from 'uuid';

import { MongoQueuedPlayersRepository } from '@/infra/mongo/queued-players.repository';
import { QueuedPlayerEntity } from '@/players/entity/queued-player.entity';
import { MongodbModule } from '@/infra/mongo/mongodb.module';
import mongoTestConnection from '@/config/mongo-connection-test.config';
import mongodbCollection from '@/config/mongo-collection.config';

describe('MongoQueuedPlayersRepository', () => {
  let module: TestingModule;

  let service: MongoQueuedPlayersRepository;

  const timestamp = '2025-04-01T11:42:19.088Z';

  const [
    player1Id,
    player2Id,
    player3Id,
    player4Id,
    player5Id,
    player6Id,
    player7Id,
    player8Id,
    player9Id,
  ] = [
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
    uuidv4(),
  ];

  const player1 = new QueuedPlayerEntity(
    player1Id,
    20,
    ['Tank', 'Damage'],
    ['Deadmines'],
    timestamp,
  );

  const player2 = new QueuedPlayerEntity(
    player2Id,
    21,
    ['Healer'],
    ['Deadmines'],
    timestamp,
  );

  const player3 = new QueuedPlayerEntity(
    player3Id,
    20,
    ['Damage'],
    ['Deadmines'],
    timestamp,
  );

  const player4 = new QueuedPlayerEntity(
    player4Id,
    21,
    ['Healer'],
    ['Deadmines'],
    timestamp,
  );

  const player5 = new QueuedPlayerEntity(
    player5Id,
    21,
    ['Tank'],
    ['Deadmines'],
    timestamp,
  );

  // const player6 = new QueuedPlayerEntity(
  //   player6Id,
  //   21,
  //   ['Damage'],
  //   ['WailingCaverns'],
  //   timestamp,
  //   [player7Id, player8Id, player9Id],
  // );

  // const player7 = new QueuedPlayerEntity(
  //   player7Id,
  //   22,
  //   ['Damage'],
  //   ['WailingCaverns'],
  //   timestamp,
  //   [player6Id, player8Id, player9Id],
  // );

  // const player8 = new QueuedPlayerEntity(
  //   player8Id,
  //   20,
  //   ['Damage'],
  //   ['WailingCaverns'],
  //   timestamp,
  //   [player6Id, player7Id, player9Id],
  // );

  // const player9 = new QueuedPlayerEntity(
  //   player9Id,
  //   20,
  //   ['Tank'],
  //   ['WailingCaverns'],
  //   timestamp,
  //   [player6Id, player7Id, player8Id],
  // );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [mongoTestConnection, mongodbCollection],
        }),
        MongodbModule.forRootAsync({
          useFactory(config: ConfigService) {
            const values = config.get('mongoTestConnection') as {
              url: string;
              dbName: string;
            };

            return Promise.resolve({
              url: values.url,
              dbName: values.dbName,
            });
          },
          inject: [ConfigService],
        }),
      ],
      providers: [],
    }).compile();

    service = module.get<MongoQueuedPlayersRepository>(
      MongoQueuedPlayersRepository,
    );
  });

  afterAll(async () => {
    await service.dequeue([
      player1Id,
      player2Id,
      player3Id,
      player4Id,
      player5Id,
      player6Id,
      player7Id,
      player8Id,
      player9Id,
    ]);

    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('manipulating players', () => {
    it('executes all repo operations', async () => {
      const queued = await service.queue([
        player1,
        player2,
        player3,
        player4,
        player5,
      ]);

      expect(queued).toEqual(5);

      await expect(service.queue([player2])).rejects.toThrow(
        'Player already queued',
      );

      const retrieved = await service.get([
        player1.id,
        player2.id,
        player3.id,
        player4.id,
        player5.id,
      ]);

      expect(retrieved).toEqual([player1, player2, player3, player4, player5]);

      const removed = await service.dequeue([player2.id, player3.id]);

      expect(removed).toEqual(2);
    });
  });
});
