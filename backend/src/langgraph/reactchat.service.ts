import { ChatOllama } from "@langchain/ollama";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { END, MemorySaver, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import { config } from "src/config";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { Tool, tool } from "@langchain/core/tools";
import * as z from "zod";

// ── 工具定义 ──────────────────────────────────────────
// 工具1 ：计算器
const calculatorTool = tool(
  async ({ expression }) => {
    try {
      const result = Function(`'use strict'; return (${expression})`)()
      return `计算结果：${expression} = ${result}`
    } catch (e: any) {
      return `计算错误：${e.message}`
    }
  },
  {
    name: 'calculator',
    description: '计算数学表达式，例如：(2 + 3) * 4',
    schema: z.object({
      expression: z.string().describe('合法的 JS 数学表达式'),
    }),
  }
)
// 工具2：查询天气a
const weatherTool = tool(
  async ({ city }) => {
    const mock: Record<string, string> = {
      '北京': '晴，35。8°C，东北风 6 级',
      '上海': '多云，28°C，东风 2 级',
      '武汉': '晴，33°C，南风 1 级',
      '广州': '雷阵雨，32°C，南风 2 级',
    }
    return mock[city] ?? `${city}：晴，22°C，微风`
  },
  {
    name: 'get_weather',
    description: '查询指定城市的当前天气',
    schema: z.object({
      city: z.string().describe('城市名，如：北京、上海、武汉'),
    }),
  }
)

const tools = [calculatorTool, weatherTool]

@Injectable()
export class ReactchatService implements OnModuleInit {
  private reactLlm: any;
  onModuleInit() {
    const llm = new ChatOllama({
      model: config.langGraph.model,
      baseUrl: config.langGraph.baseURL,
      temperature: config.langGraph.temperature,
      think: false,
      numPredict: 512
    });

    const llmWithTools = llm.bindTools([...tools]);
    const callModel = async (state: typeof MessagesAnnotation.State) => {
      const messages = [
        new SystemMessage(
          `你是专业助手，可用工具：
          - calculator：数学计算
          - get_weather：查询天气
          根据问题决定是否调用工具。`
        ),
        ...state.messages
      ]
      const resopnse = await llmWithTools.invoke(messages);
      return { messages: [resopnse] }
    }
    const shouldContinue = (state: typeof MessagesAnnotation.State) => {
      const lastMessage = state.messages.at(-1) as AIMessage;
      
      const target = (lastMessage?.tool_calls?.length ?? 0) > 0 ? 'tools' : END;
      console.log(lastMessage, target);
      return target;
    }
    this.reactLlm = new StateGraph(MessagesAnnotation)
      .addNode('callModel', callModel)
      .addNode('tools', new ToolNode(tools))
      .addEdge(START, 'callModel')
      .addConditionalEdges('callModel', shouldContinue, {
        tools: 'tools',
        [END]: END,
      })
      .addEdge('tools', 'callModel')
      .compile({ checkpointer: new MemorySaver() });
    console.log(`✅ ReactchatService 初始化完成，模型：${config.langGraph.model}`)
  }
  async reactChat(threadId: string, message: string): Promise<string> {
    const response = await this.reactLlm.invoke(
      { messages: [new HumanMessage(message)] },
      { configurable: { thread_id: threadId }, recursionLimit: 4 }
    );
    return response.messages.at(-1)?.content;
  }
}