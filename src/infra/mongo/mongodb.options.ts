import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MongoClientOptions } from 'mongodb';

export interface MongoDbDriverModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useClass?: Type<MongoDbDriverOptionsFactory>;
  useExisting?: Type<MongoDbDriverOptionsFactory>;
  useFactory?: (config: ConfigService) => Promise<MongoDbDriverModuleOptions>;
}

export interface MongoDbDriverOptionsFactory {
  createMongoDbOptions(
    connectionName?: string,
  ): Promise<MongoDbDriverModuleOptions> | MongoDbDriverModuleOptions;
}

export interface MongoDbDriverModuleOptions {
  name?: string;
  url: string;
  clientOptions?: MongoClientOptions | undefined;
  dbName?: string;
  retryAttempts?: number;
  retryDelay?: number;
}
