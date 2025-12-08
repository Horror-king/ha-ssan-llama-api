const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const port = process.env.PORT || 5000;

// ⚠️ Directly including your API key for Vercel deployment
const groq = new Groq({ apiKey: "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" });

app.use(cors()); // Enable CORS

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
      model: "openai/gpt-oss-20b" // supported model
    });

    return res.json({
      response: chatCompletion.choices[0]?.message?.content || ""
    });
  } catch (err) {
    console.error("Error from Groq:", err);
    return res.status(500).json({
      error: err.response?.data?.message || err.message || "Unknown error occurred"
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
