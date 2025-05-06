import { Test, TestingModule } from '@nestjs/testing';

import { mock } from 'ts-jest-mocker';

import { DungeonGroupsService } from '@/groups/dungeon-groups.service';
import {
  DungeonGroupsRepository,
  DungeonGroupsRepositoryToken,
} from '@/groups/interface/dungeon-groups-repository.interface';

describe('DungeonGroupsService', () => {
  let service: DungeonGroupsService;

  const mockedDungeonGroupsRepository = mock<DungeonGroupsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DungeonGroupsService,
        {
          provide: DungeonGroupsRepositoryToken,
          useValue: mockedDungeonGroupsRepository,
        },
      ],
    }).compile();

    service = module.get<DungeonGroupsService>(DungeonGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
