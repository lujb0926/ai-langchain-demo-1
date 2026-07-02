import { Module } from '@nestjs/common';
import { LanggraphService } from './langgraph.service';
import { LanggraphController } from './langgraph.controller';
import { ReactchatService } from './reactchat.service';

@Module({
  controllers: [LanggraphController],
  providers: [
    LanggraphService,
    ReactchatService
  ],
})
export class LanggraphModule {}
