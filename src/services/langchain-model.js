const { ChatOpenAI } = require('@langchain/openai');

const model = new ChatOpenAI({
  modelName: 'gpt-4.1',
  temperature: 0.2,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

module.exports = { model };
