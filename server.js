require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const Groq = require('groq-sdk');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {

    const { message } = req.body;

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `
You are a professional AI real estate assistant.

Rules:
- Reply naturally
- Keep replies short
- Ask qualifying questions
- Sound human
- Help convert leads
            `,
          },
          {
            role: 'user',
            content: message,
          },
        ],

       model: 'llama-3.3-70b-versatile',
      });

    const reply =
      completion.choices[0].message.content;

    res.json({
      success: true,
      reply,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});