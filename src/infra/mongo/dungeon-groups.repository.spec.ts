import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { v4 as uuidv4 } from 'uuid';

import { MongoDungeonGroupsRepository } from '@/infra/mongo/dungeon-groups.repository';
import { MongodbModule } from '@/infra/mongo/mongodb.module';
import mongoTestConnection from '@/config/mongo-connection-test.config';
import mongodbCollection from '@/config/mongo-collection.config';
import { DungeonGroupModel } from '@/groups/model/dungeon-group.model';

describe('MongoDungeonGroupsRepository', () => {
  let module: TestingModule;

  let service: MongoDungeonGroupsRepository;

  // const timestamp = '2025-04-01T11:42:19.088Z';

  const group1 = new DungeonGroupModel(
    uuidv4(),
    'WailingCaverns',
    uuidv4(),
    uuidv4(),
    [uuidv4(), uuidv4(), uuidv4()],
  );

  const group2 = new DungeonGroupModel(
    uuidv4(),
    'RagefireChasm',
    uuidv4(),
    uuidv4(),
    [uuidv4(), uuidv4(), uuidv4()],
  );

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

    service = module.get<MongoDungeonGroupsRepository>(
      MongoDungeonGroupsRepository,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('perform database operations', async () => {
    const created = await service.create([group1, group2]);

    expect(created).toEqual(2);

    const deleted = await service.remove([group1.groupId, group2.groupId]);

    expect(deleted).toEqual(2);
  });
});
