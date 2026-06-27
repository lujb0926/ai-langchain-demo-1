/*
 * @Author: lujiangbo knight_lujb@163.com
 * @Date: 2026-06-27 21:45:44
 * @LastEditors: lujiangbo knight_lujb@163.com
 * @LastEditTime: 2026-06-27 22:10:37
 * @Description: 
 */
import * as dotenv from 'dotenv';
/**
 * 统一配置文件
 *
 * 本地开发：设置 OLLAMA_BASE_URL=http://localhost:11434/v1，模型用 qwen3.5:0.8b
 * 生产环境：切换为云端 API（DeepSeek / OpenAI 等），只需改 .env，代码不动
 */
const envConfig = dotenv.config();
export const config = {
  app: {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  langGraph: {
    model: process.env.LANGGRAPH_MODEL || 'ollama',
    baseURL: (process.env.OLLAMA_BASE_URL || '')?.split('/v1')[0],
    apiKey: process.env.OLLAMA_API_KEY || 'allama',
    // 温度（0=确定性输出，1=创意输出）
    temperature: 0.7
  },
  cors: {
    // 允许的前端地址，多个用逗号分隔
    origins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://localhost:5175').split(','),
  }
}