import { DynamicModule, Global, Module } from '@nestjs/common';

import {
  MongoDbDriverModuleOptions,
  MongoDbDriverModuleAsyncOptions,
} from '@/infra/mongo/mongodb.options';
import { CoreModule } from '@/infra/mongo/core.module';
import { HelperModule } from '@/helper/helper.module';
import { MongoDungeonGroupsRepository } from '@/infra/mongo/dungeon-groups.repository';
import { DungeonGroupsRepositoryToken } from '@/groups/interface/dungeon-groups-repository.interface';

@Global()
@Module({
  imports: [HelperModule],
  providers: [
    MongoDungeonGroupsRepository,
    {
      provide: DungeonGroupsRepositoryToken,
      useClass: MongoDungeonGroupsRepository,
    },
  ],
  exports: [
    {
      provide: DungeonGroupsRepositoryToken,
      useClass: MongoDungeonGroupsRepository,
    },
  ],
})
export class MongodbModule {
  public static forRoot(options: MongoDbDriverModuleOptions): DynamicModule {
    return {
      module: MongodbModule,
      imports: [CoreModule.forRoot(options)],
    };
  }

  public static forRootAsync(
    options: MongoDbDriverModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: MongodbModule,
      imports: [CoreModule.forRootAsync(options)],
    };
  }
}
