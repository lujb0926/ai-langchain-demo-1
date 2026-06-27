/*
 * @Author: lujiangbo knight_lujb@163.com
 * @Date: 2026-06-27 18:23:28
 * @LastEditors: lujiangbo knight_lujb@163.com
 * @LastEditTime: 2026-06-27 18:25:55
 * @Description: 
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
