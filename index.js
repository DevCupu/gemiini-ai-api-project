const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

const upload = multer({ dest: "uploads/" }); // This will save uploaded files to an 'uploads' directory

const PORT = 3000;

// Endpoint for generating text
app.post("/generate-text", async (req, res) => {
  const { prompt } = req.body; // Retrieves the user's prompt input sent from the client (e.g., Postman or frontend).

  try {
    const result = await model.generateContent(prompt); // Sends the prompt to the Gemini model (e.g., Gemini 1.5 Flash) and waits for a response.
    const response = await result.response;
    res.json({ output: response.text() }); // Extracts the generated text from the Gemini model's response and returns it as a JSON response to the client.
  } catch (error) {
    // Error Handling with catch
    // If any error occurs, the catch block handles it and responds with HTTP 500 and the relevant error message.
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for generating text from an image
app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  const prompt = req.body.prompt || "Describe the image"; // If a custom prompt is included in the request body (req.body.prompt),
  // it will be combined with the image to form a multimodal input.
  // Otherwise, the default prompt "Describe the image" is used.

  if (!req.file) {
    return res.status(400).send("No image file uploaded.");
  }

  const image = fileToGenerativePart(req.file.path, req.file.mimetype);

  try {
    // The model is then called using generateContent(prompt, image), and the AI-generated text is returned as a JSON response.
    const result = await model.generateContent([prompt, image]);
    const response = await result.response;
    res.json({ output: response.text() });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // Delete the temporary file
    }
  }
});

// Endpoint for generating text from a document
app.post(
  "/generate-from-document",
  upload.single("document"),
  async (req, res) => {

    if (!req.file) {
      return res.status(400).send("No document file uploaded.");
    }

    const filePath = req.file.path;

    try {
      const buffer = fs.readFileSync(filePath);
      const base64Data = buffer.toString("base64");
      const mimeType = req.file.mimetype;

      const documentPart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };
      const result = await model.generateContent([
        "Analyze this document:",
        documentPart,
      ]);
      const response = await result.response;
      res.json({ output: response.text() });
    } catch (error) {
      console.error("Error processing document:", error);
      res.status(500).json({ error: error.message });
    } finally {
      if (req.file && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the temporary file
      }
    }
  }
);

// Endpoint for generating text from audio
app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {

  if (!req.file) {
    return res.status(400).send('No audio file uploaded.');
  }

  const filePath = req.file.path;

  try {
    
    const audioBuffer = fs.readFileSync(filePath);
    const base64Audio = audioBuffer.toString('base64');
    const mimeType = req.file.mimetype;

    const audioPart = {
      inlineData: {
        data: base64Audio,
        mimeType: mimeType
      }
    };
    const result = await model.generateContent([
      'Transcribe or analyze the following audio:',
      audioPart
    ]);
    const response = await result.response;
    res.json({ output: response.text() });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (req.file && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the temporary file
    }
  }
});

app.listen(PORT, () => {
  console.log(`Gemini API server is running at http://localhost:${PORT}`);
});
