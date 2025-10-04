import { Module, Global } from '@nestjs/common';
import { ReplicateService } from './replicate.service';

@Global()
@Module({
  providers: [ReplicateService],
  exports: [ReplicateService],
})
export class ReplicateModule {}
