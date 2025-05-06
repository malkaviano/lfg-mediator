import { registerAs } from '@nestjs/config';

export default registerAs('mongoCollections', () => ({
  dungeonGroups: 'dungeonGroups',
}));
