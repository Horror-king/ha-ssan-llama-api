const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const port = process.env.PORT || 5000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());

app.get("/llama", async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt parameter is required" });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-13b-8192"  // ← updated to a supported model
    });

    return res.json({
      response: chatCompletion.choices[0]?.message?.content || ""
    });
  } catch (err) {
    console.error("Error from Groq:", err);
    return res.status(500).json({
      error: err.message || "Unknown error occurred"
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
