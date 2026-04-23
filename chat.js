import { AzureChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

const llm = new AzureChatOpenAI({
    temperature: 0.4,
    verbose: false,
    logprobs: true
});

let messages = [
    new SystemMessage("You're an enthusiastic biology expert who loves talking about strange and obscure animals. You have a lot of knowledge about the animal kingdom and enjoy sharing interesting facts about it.")
];

export async function callOpenAI(message) {

    messages.push(new HumanMessage(message));

    const response = await llm.invoke(messages);

    messages.push(new AIMessage(response.content));

    console.log(response.content);
    return{
        messages: response.content,
        tokens: response.usage_metadata.total_tokens ?? 0
    }
}