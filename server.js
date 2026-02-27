const express = require('express');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Keep responses concise.' },
        ...messages
      ],
      max_tokens: 1024
    });

    res.json({
      message: completion.choices[0].message
    });
  } catch (error) {
    console.error('OpenAI error:', error.message);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
