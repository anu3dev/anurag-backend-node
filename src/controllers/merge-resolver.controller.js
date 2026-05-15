const OpenAI = require('openai');
const { getPullRequestFiles, getPullRequestDetails } = require('../services/github.service');
const { analyzePullRequest } = require('../services/analyze-pr.service');

let _openai;
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

// POST /analyze-pr
const analyzePR = async (req, res) => {
  const { owner, repo, pullNumber } = req.body;

  if (!owner || !repo || !pullNumber) {
    return res.status(400).json({ error: 'owner, repo, and pullNumber are required.' });
  }

  try {
    // Fetch PR metadata and changed files in parallel
    const [prDetails, files] = await Promise.all([
      getPullRequestDetails(owner, repo, pullNumber),
      getPullRequestFiles(owner, repo, pullNumber),
    ]);

    // Generate AI analysis using LangChain
    const analysis = await analyzePullRequest(prDetails.title, prDetails.body, files);

    // Return in the shape the frontend expects
    return res.status(200).json({
      analysis,
      files: files.map((f) => ({
        filename: f.filename,
        patch: f.patch || '',
      })),
      filesChanged: files.length,
    });
  } catch (error) {
    console.error('Analyze PR error:', error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Failed to analyze PR.' });
  }
};

// POST /stream-resolve
const streamResolve = async (req, res) => {
  const { conflict } = req.body;

  if (!conflict) {
    return res.status(400).json({ error: 'conflict field is required.' });
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const stream = await getOpenAI().chat.completions.create({
      model: 'gpt-4.1',
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are an expert software engineer who resolves git merge conflicts and analyzes diffs.

When given a diff or merge conflict:
1. Explain what each side (added/removed lines) is doing
2. Identify potential risks or breaking changes
3. Provide the final clean resolved code inside a fenced code block (\`\`\`)

IMPORTANT: You MUST include a fenced code block (\`\`\`) containing ONLY the resolved/clean code. The UI extracts code from this block.`,
        },
        {
          role: 'user',
          content: `Analyze and resolve this diff/conflict:\n\n${conflict}`,
        },
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Final done event
    res.write(`data: ${JSON.stringify({ content: '', done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Stream resolve error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Streaming failed: ' + (error.message || 'Unknown error') })}\n\n`);
    res.end();
  }
};

module.exports = { analyzePR, streamResolve };
