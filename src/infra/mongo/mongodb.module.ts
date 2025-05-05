import { DynamicModule, Global, Module } from '@nestjs/common';

import {
  MongoDbDriverModuleOptions,
  MongoDbDriverModuleAsyncOptions,
} from '@/infra/mongo/mongodb.options';
import { CoreModule } from '@/infra/mongo/core.module';
import { HelperModule } from '@/helper/helper.module';
import { MongoQueuedPlayersRepository } from '@/infra/mongo/queued-players.repository';
import { QueuedPlayersRepositoryToken } from '@/players/interface/queued-players-repository.interface';

@Global()
@Module({
  imports: [HelperModule],
  providers: [
    MongoQueuedPlayersRepository,
    {
      provide: QueuedPlayersRepositoryToken,
      useClass: MongoQueuedPlayersRepository,
    },
  ],
  exports: [
    {
      provide: QueuedPlayersRepositoryToken,
      useClass: MongoQueuedPlayersRepository,
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
