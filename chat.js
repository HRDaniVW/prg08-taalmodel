import { AzureChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { response } from "express";

const llm = new AzureChatOpenAI({
    temperature: 0.5,
    verbose: false,
    logprobs: true
});

const userSession = new Map();

const aiPersonality = new SystemMessage(`You are a passionate and enthusiastic wildlife biologist, inspired by the energy and wonder of Steve Irwin and Freek Vonk. You specialize in explaining animals and nature with infectious enthusiasm and accessible knowledge.

Your personality:
- Share your genuine excitement about the incredible diversity of life
- Use relatable analogies and vivid descriptions
- Always include interesting and surprising facts about animals
- Make science fun and engaging for all ages and knowledge levels
- Encourage appreciation and respect for wildlife

Your expertise:
- You have accurate knowledge about animals, their behavior, ecosystems, and evolution
- You can answer questions from complete beginners to more advanced naturalists
- You provide practical information while maintaining scientific accuracy

Your boundaries:
- You do NOT provide information that could be used to harm animals
- If asked about animal violence or harm, politely decline and redirect to positive aspects of animal behavior
- You maintain respect for wildlife in all your responses

Remember: Your goal is to inspire curiosity, respect, and love for the natural world!`)

let messages = [
    aiPersonality
];

function isViolenceRelated(text) {
    const violenceKeywords = [
        'schade',
        'doden',
        'verwonden',
        'aanvallen',
        'schieten',
        'vergiftigen',
        'vermoorden',
        'diermishandeling',
        'dierlijke wreedheid',
        'dierlijke mishandeling',
        'dierlijke marteling',
        'dierlijke foltering',
        'dierlijke pijn',
        'dierlijke lijden',
        'dierlijke dood',
        'dierlijke verwonding',
        'dierlijke aanval',
        'dierlijke schade',
        'dierlijke mishandeling',
        'dierlijke wreedheid',
        'dierlijke marteling',
        'haanenvechten',
        'hondenvechten',
        'stierenvechten',
        'dierenvechten',
        'dierenwreedheid',
    ];
    const lowerText = text.toLowerCase();
    return violenceKeywords.some(keyword => lowerText.includes(keyword));
}

export async function callOpenAI(message, sessionId) {

    if (!userSession.has(sessionId)) {
        userSession.set(sessionId, [aiPersonality]);
    }

    const messages = userSession.get(sessionId);
    messages.push(new HumanMessage(message));

    if (isViolenceRelated(message)) {
        return {
            messages: "Ik kan geen informatie geven over het toebrengen van schade aan dieren. In plaats daarvan kan ik je vertellen over het natuurlijk gedrag van dieren, hun fascinerende adaptaties, or hoe we dieren kunnen beschermen! Wat wil je liever over dieren weten?",
            tokens: 0,
            isBlocked: true
        };
    }

    const response = await llm.invoke(messages);

    messages.push(new AIMessage(response.content));

    console.log(response.content);
    return{
        messages: response.content,
        tokens: response.usage_metadata.total_tokens ?? 0
    }

}