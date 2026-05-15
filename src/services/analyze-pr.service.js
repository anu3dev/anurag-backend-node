const { PromptTemplate } = require('@langchain/core/prompts');
const { model } = require('./langchain-model');

async function analyzePullRequest(prTitle, prBody, files) {
  const formattedFiles = files
    .map((file) => `FILE: ${file.filename}\nSTATUS: ${file.status}\nCHANGES: +${file.additions} -${file.deletions}\n\nPATCH:\n${file.patch || 'No patch available'}`)
    .join('\n\n---\n\n');

  const prompt = PromptTemplate.fromTemplate(`
You are a senior software engineer reviewing a GitHub Pull Request.

PR Title: {prTitle}
PR Description: {prBody}

Analyze the following changes:
- Summarize what each file change does
- Identify possible risks or bugs
- Flag potential merge conflict areas
- Note any code quality concerns
- Provide actionable suggestions

Pull Request Files:
{files}
`);

  const formattedPrompt = await prompt.format({
    prTitle: prTitle || 'No title',
    prBody: prBody || 'No description',
    files: formattedFiles,
  });

  const response = await model.invoke(formattedPrompt);
  return response.content;
}

module.exports = { analyzePullRequest };
