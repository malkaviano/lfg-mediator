import { Module } from '@nestjs/common';

import { DateTimeHelper } from '@/helper/datetime.helper';
import { IdHelper } from '@/helper/id.helper';

@Module({
  providers: [DateTimeHelper, IdHelper],
  exports: [DateTimeHelper, IdHelper],
})
export class HelperModule {}
