/*
 * @Author: lujiangbo knight_lujb@163.com
 * @Date: 2026-06-28 07:18:41
 * @LastEditors: lujiangbo knight_lujb@163.com
 * @LastEditTime: 2026-06-28 20:17:25
 * @Description: 
 */
import { Body, Controller, Post } from '@nestjs/common';
import { LanggraphService } from './langgraph.service';

@Controller('langgraph')
export class LanggraphController {
  constructor(
    private readonly langgraphService: LanggraphService
  ) { }
  @Post('memory-chat')
  memoryChat(@Body() body: { threadId: string; message: string }) {
    return this.langgraphService.memoryChat(body.threadId, body.message).then(answer => ({ answer }));
  }
}
