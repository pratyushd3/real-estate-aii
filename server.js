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

app.get('/', (req, res) => {
  res.send('AI Real Estate Assistant is Live 🚀');
});

app.post('/chat', async (req, res) => {

  try {

    const { messages } = req.body;

    const completion =
      await groq.chat.completions.create({

        messages: [

          {
            role: 'system',
            content: `

You are an expert AI real estate assistant.

IMPORTANT RULES:

- Remember previous conversation context
- Never ask same question twice
- Be conversational and smart
- Understand budgets naturally
- If user already gave budget/location/property type,
  do not ask again
- Guide user like real property consultant
- Keep replies short and human
- Ask only missing details
- Focus on helping customer quickly

`
          },

          ...messages

        ],

        model: 'llama-3.3-70b-versatile',

      });

    const reply =
      completion.choices[0].message.content;

    res.json({
      success: true,
      reply
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});