# Gemini Flash API

A comprehensive Express.js API server that integrates with Google's Gemini AI model to provide text generation capabilities from various input types including text prompts, images, documents, and audio files.

## Features

- **Text Generation**: Generate AI-powered text responses from simple text prompts
- **Image Analysis**: Upload images and get AI-generated descriptions or analysis
- **Document Processing**: Analyze and extract insights from uploaded documents
- **Audio Transcription**: Transcribe and analyze audio files using AI
- **File Upload Support**: Secure file handling with automatic cleanup
- **Error Handling**: Comprehensive error handling and validation

## Technologies Used

- **Express.js**: Web framework for Node.js
- **Google Generative AI**: Gemini 1.5 Flash model integration
- **Multer**: Middleware for handling multipart/form-data (file uploads)
- **dotenv**: Environment variable management
- **File System (fs)**: File operations and cleanup

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gemini-flash-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Create the uploads directory (if it doesn't exist):
```bash
mkdir uploads
```

## Usage

### Starting the Server

```bash
node index.js
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Generate Text from Prompt

**Endpoint**: `POST /generate-text`

**Description**: Generates AI text responses based on a text prompt.

**Request Body**:
```json
{
  "prompt": "Your text prompt here"
}
```

**Response**:
```json
{
  "output": "AI-generated text response"
}
```

**Example using curl**:
```bash
curl -X POST http://localhost:3000/generate-text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a short story about a robot"}'
```

### 2. Generate Text from Image

**Endpoint**: `POST /generate-from-image`

**Description**: Analyzes uploaded images and generates descriptive text or answers questions about the image content.

**Request**:
- **Form Data**: 
  - `image` (file): The image file to analyze
  - `prompt` (text, optional): Custom prompt for image analysis (default: "Describe the image")

**Response**:
```json
{
  "output": "AI-generated description or analysis of the image"
}
```

**Supported Image Formats**: 
- JPEG, PNG, GIF, WebP, and other common image formats

**Example using curl**:
```bash
curl -X POST http://localhost:3000/generate-from-image \
  -F "image=@path/to/your/image.jpg" \
  -F "prompt=What objects can you see in this image?"
```

### 3. Generate Text from Document

**Endpoint**: `POST /generate-from-document`

**Description**: Analyzes uploaded documents and extracts insights, summaries, or answers questions about the document content.

**Request**:
- **Form Data**: 
  - `document` (file): The document file to analyze

**Response**:
```json
{
  "output": "AI-generated analysis of the document"
}
```

**Supported Document Formats**: 
- PDF, DOC, DOCX, TXT, and other document formats

**Example using curl**:
```bash
curl -X POST http://localhost:3000/generate-from-document \
  -F "document=@path/to/your/document.pdf"
```

### 4. Generate Text from Audio

**Endpoint**: `POST /generate-from-audio`

**Description**: Transcribes and analyzes uploaded audio files.

**Request**:
- **Form Data**: 
  - `audio` (file): The audio file to transcribe/analyze

**Response**:
```json
{
  "output": "AI-generated transcription or analysis of the audio"
}
```

**Supported Audio Formats**: 
- MP3, WAV, M4A, and other common audio formats

**Example using curl**:
```bash
curl -X POST http://localhost:3000/generate-from-audio \
  -F "audio=@path/to/your/audio.mp3"
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400`: Bad Request (missing file or invalid input)
- `500`: Internal Server Error (API errors, processing failures)

## Code Structure

### Main Components

1. **Express App Setup**: Basic Express.js server configuration with JSON parsing middleware
2. **Gemini AI Integration**: Google Generative AI client setup with Gemini 1.5 Flash model
3. **File Upload Handling**: Multer configuration for temporary file storage
4. **Endpoint Handlers**: Four main API endpoints for different input types
5. **File Cleanup**: Automatic deletion of temporary uploaded files after processing

### Key Functions

#### `fileToGenerativePart(path, mimeType)`
*Note: This function is referenced in the image endpoint but not defined in the provided code. It should convert a file to a format suitable for the Gemini API.*

### Security Features

- **File Cleanup**: Temporary uploaded files are automatically deleted after processing
- **Error Handling**: Comprehensive try-catch blocks prevent server crashes
- **Input Validation**: Checks for required files before processing

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Development

### Project Structure
```
gemini-flash-api/
├── index.js          # Main server file
├── package.json       # Dependencies and scripts
├── README.md         # Documentation
├── .env              # Environment variables (create this)
└── uploads/          # Temporary file storage (auto-created)
```

### Adding New Features

To add new endpoints:
1. Define the route using `app.post()` or other HTTP methods
2. Add appropriate middleware (e.g., `upload.single()` for file uploads)
3. Implement the handler function with try-catch error handling
4. Clean up any temporary files in the `finally` block

## Troubleshooting

### Common Issues

1. **"No API key found"**: Ensure your `.env` file contains `GEMINI_API_KEY`
2. **"No file uploaded"**: Check that you're sending files with the correct field names
3. **"File not found"**: Verify file paths and ensure the uploads directory exists
4. **API Rate Limits**: Check your Gemini API usage and rate limits

### Debug Mode

To enable detailed error logging, you can modify the error handlers to include more information:

```javascript
console.error("Detailed error:", error);
