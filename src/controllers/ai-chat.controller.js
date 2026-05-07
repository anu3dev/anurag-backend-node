const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const handleChat = async (req, res) => {
  const { model, messages, temperature, max_tokens } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: { message: 'messages array is required.' } });
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens || 1024,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('AI chat error:', error);
    return res.status(500).json({ error: { message: 'Failed to get AI response.' } });
  }
};

module.exports = { handleChat };
