/*
 * @Author: lujiangbo knight_lujb@163.com
 * @Date: 2026-06-27 18:22:28
 * @LastEditors: lujiangbo knight_lujb@163.com
 * @LastEditTime: 2026-06-28 07:18:48
 * @Description: 
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LanggraphModule } from './langgraph/langgraph.module';

@Module({
  imports: [LanggraphModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
