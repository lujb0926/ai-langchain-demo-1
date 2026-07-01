/*
 * @Author: lujiangbo knight_lujb@163.com
 * @Date: 2026-06-28 07:18:41
 * @LastEditors: lujiangbo knight_lujb@163.com
 * @LastEditTime: 2026-06-28 20:24:58
 * @Description: 
 */
export const runtime = "nodejs";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { END, MemorySaver, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import { ChatOllama } from '@langchain/ollama';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { config } from 'src/config';

@Injectable()
export class LanggraphService implements OnModuleInit {
  private memoryGraph: any;
  onModuleInit() {
    const ollama = new ChatOllama({
      model: config.langGraph.model,
      baseUrl: config.langGraph.baseURL,
      temperature: config.langGraph.temperature,
      think: false,
      numPredict: 512
    })
    const chatWithMemory = async (state: typeof MessagesAnnotation.State) => {
      const messages = [
        new SystemMessage('你是专业的 AI 助手，请记住对话上下文。'),
        ...state.messages
      ]
      const response = await ollama.invoke(messages);
      return { messages: [response] }
    }
    this.memoryGraph = new StateGraph(MessagesAnnotation)
      .addNode('chat', chatWithMemory)
      .addEdge(START, 'chat')
      .addEdge('chat', END)
      .compile({ checkpointer: new MemorySaver() });
    console.log(`✅ LanggraphService 初始化完成，模型：${config.langGraph.model}`)

  }

  async memoryChat(threadId: string, message: string): Promise<any> {
    const result = await this.memoryGraph.invoke(
      { messages: [new HumanMessage(message)] },
      { configurable: { thread_id: threadId } }
    )
    console.log("AI1： result", result.messages);
    console.log("AI1：", result.messages.at(-1)?.content);
    return result.messages.at(-1)?.content
  }

  async getHistory(threadId: string): Promise<any> {
    const res = await this.memoryGraph.getState({ configurable: { thread_id: threadId } })
    return (res.values.messages ?? []).map((m: any, i: number) => ({
      index: i,
      role: m._getType?.() === 'human' ? 'user' : 'assistant',
      content: m.content,
    }))
  }

}
