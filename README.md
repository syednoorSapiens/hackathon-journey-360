# Journey 360 (Phase 2) 🚀

An AI-powered form builder that transforms natural language requirements into fully functional, production-ready forms using Azure OpenAI and Whisper API integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Project Structure](#project-structure)
- [Key Design Decisions](#key-design-decisions)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Journey 360 is an intelligent form builder that allows users to create complex forms through:
- **Natural Language Input**: Describe your form requirements in plain text
- **Voice Input**: Use speech-to-text powered by Azure Whisper API
- **File Upload**: Upload existing form descriptions or schemas
- **Visual Editor**: Drag-and-drop form builder with real-time preview

The application leverages AI to automatically generate form schemas, validation rules, test cases, and mock APIs.

**Original Design**: [Figma Prototype](https://dent-solid-09600871.figma.site)

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: 
  - Tailwind CSS
  - Radix UI Components (Accessible, Unstyled Components)
  - Custom UI Components Library
- **State Management**: React Hooks (useState, useRef, useCallback)
- **Rich Text Editor**: TipTap
- **Animations**: Lottie React
- **Charts**: Recharts
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)
- **HTTP Client**: Axios

### Backend Integration
- **Speech-to-Text**: Azure OpenAI Whisper API
- **AI Processing**: Azure OpenAI (GPT-4/GPT-3.5)
- **Backend API**: Express.js server (Journey 360 Backend)
- **File Handling**: Multer (for audio uploads)

### Development Tools
- **Package Manager**: pnpm
- **TypeScript**: Full type safety
- **Build Optimization**: SWC (Speedy Web Compiler)

## ✨ Features

### Core Features
- 🎤 **Voice-to-Form**: Speak your requirements and generate forms instantly
- 📝 **Text-to-Form**: Type natural language descriptions
- 📤 **Upload-to-Form**: Upload existing form files
- 🎨 **Visual Form Editor**: Drag-and-drop interface with live preview
- 🔍 **Schema Viewer**: View and edit generated JSON schemas
- ✅ **Automatic Validation**: AI-generated validation rules
- 🧪 **Test Generation**: Automatic test case creation
- 🔌 **Mock API**: Generate mock endpoints for testing
- 🌓 **Dark Mode**: Full dark mode support
- 💾 **Export Options**: Export forms, schemas, and tests

### Advanced Features
- Multi-step form support (Linear, Branching, Progressive)
- Conditional field rendering
- Complex validation rules
- Real-time form preview
- Component library integration
- Professional templates (ACKO, Travel Insurance, Death Claim)
- Flow chart visualization
- API schema viewer

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│                                                               │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐     │
│  │  Login     │→ │ Main Prompt │→ │  Form Editor     │     │
│  │  Screen    │  │   Screen    │  │     Page         │     │
│  └────────────┘  └─────────────┘  └──────────────────┘     │
│                         ↓                    ↓               │
│                  ┌──────────────────────────────┐            │
│                  │   WhisperService (Audio)     │            │
│                  │   AIParser (Text Processing) │            │
│                  │   FormRenderer (Preview)     │            │
│                  └──────────────────────────────┘            │
└─────────────────────────────┬───────────────────────────────┘
                               ↓
                    ┌─────────────────────┐
                    │  Journey 360 Backend │
                    │   (Express Server)   │
                    │                      │
                    │  - /api/audio/*      │
                    │  - /api/openai/*     │
                    │  - File Upload       │
                    └──────────┬───────────┘
                               ↓
              ┌────────────────────────────────┐
              │     Azure OpenAI Services      │
              │                                 │
              │  - Whisper API (Speech-to-Text)│
              │  - GPT-4/GPT-3.5 (AI Processing)│
              └─────────────────────────────────┘
```

### Data Flow

1. **Input Stage**: User provides requirements via text/speech/upload
2. **Processing Stage**: Backend processes input through Azure OpenAI
3. **Generation Stage**: AI generates form schema, validations, and tests
4. **Editing Stage**: Visual editor allows refinement
5. **Export Stage**: Output as JSON, TypeScript, or deployable package

### Component Hierarchy

```
App.tsx
├── LoginScreen
├── MainPromptScreen
│   ├── InputMode Selection
│   ├── WhisperService (Voice Input)
│   └── TextArea (Text Input)
├── FormEditorPage
│   ├── TopNav
│   ├── FormConfigurator (Left Panel)
│   ├── FormRenderer (Center Preview)
│   ├── PromptPanel (Right Panel)
│   │   ├── SchemaViewer
│   │   ├── TestViewer
│   │   └── APIViewer
│   └── RulesValidationManager
└── DeploymentDialog
```

## 📦 Setup Instructions

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Journey 360 Backend server running
- Azure OpenAI API credentials

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackathon-journey-360
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the project root:
   ```bash
   # Backend API Configuration
   VITE_BACKEND_URL=http://localhost:3002
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   The app will run on `http://localhost:3003`

### Backend Setup

1. **Navigate to your backend project**
   ```bash
   cd journey-360-backend
   ```

2. **Create backend `.env` file**
   ```bash
   # Azure OpenAI Configuration
   AZURE_WHISPER_API_KEY=your-whisper-api-key
   AZURE_WHISPER_ENDPOINT=your-whisper-endpoint
   AZURE_OPENAI_API_KEY=your-openai-api-key
   AZURE_OPENAI_ENDPOINT=your-openai-endpoint
   
   # Server Configuration
   PORT=3002
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3003
   ```

3. **Install backend dependencies**
   ```bash
   npm install express multer dotenv cors axios
   npm install --save-dev @types/express @types/multer @types/cors
   ```

4. **Start backend server**
   ```bash
   npm run dev
   ```

### Verification

1. Check frontend: Open `http://localhost:3003`
2. Check backend: Visit `http://localhost:3002/api/health` (if available)
3. Test speech-to-text: Try voice input feature

## 🎮 Usage

### Creating a Form with Voice Input

1. **Login**: Enter credentials on login screen
2. **Select Voice Input**: Click the microphone icon
3. **Speak Requirements**: Describe your form (e.g., "Create a contact form with name, email, and message fields")
4. **Review & Edit**: AI generates the form, review in editor
5. **Export**: Download as JSON, TypeScript, or full package

### Creating a Form with Text Input

1. Login to the application
2. Select "Text Input" mode
3. Type your requirements in natural language
4. Click "Generate Form"
5. Edit in visual editor if needed
6. Export your form

### Using the Form Editor

- **Left Panel**: Configure form settings, fields, and validation rules
- **Center Panel**: Live preview of your form
- **Right Panel**: View/edit schema, tests, and API definitions
- **Top Nav**: Switch views (Preview/Code/Flow), export, deploy

## 🔌 API Integration

### Whisper Speech-to-Text

**Endpoint**: `POST /api/audio/transcribe`

```typescript
// Frontend usage
const whisperService = createWhisperService();
await whisperService.startRecording();
const audioBlob = await whisperService.stopRecording();
const result = await whisperService.transcribe(audioBlob, {
  language: 'en'
});
```

**Backend handles**:
- Audio file validation
- Azure Whisper API calls
- Error handling and retry logic

### OpenAI Form Generation

**Endpoint**: `POST /api/openai/generate-form`

```typescript
// Request
{
  "requirements": "Create a registration form...",
  "options": {
    "includeValidation": true,
    "generateTests": true
  }
}

// Response
{
  "schema": { /* form schema */ },
  "tests": [ /* test cases */ ],
  "mockApi": { /* mock endpoints */ }
}
```

## 📁 Project Structure

```
hackathon-journey-360/
├── src/
│   ├── app/                    # Next.js app router (if used)
│   ├── assets/                 # Static assets (images, icons)
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── FormEditorPage.tsx # Main form editor
│   │   ├── MainPromptScreen.tsx # Input mode selection
│   │   ├── LoginScreen.tsx    # Authentication
│   │   └── ...                # Other components
│   ├── hooks/                  # Custom React hooks
│   │   └── useWhisper.ts      # Whisper service hook
│   ├── utils/                  # Utility functions
│   │   ├── whisperService.ts  # Speech-to-text service
│   │   ├── aiParser.ts        # AI response parser
│   │   ├── testGenerator.ts   # Test case generator
│   │   └── mockApi.ts         # Mock API generator
│   ├── types/                  # TypeScript type definitions
│   ├── styles/                 # Global styles
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Application entry point
├── docs/                       # Documentation
├── public/                     # Public assets
├── .env.local                 # Environment variables (local)
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md                  # This file
```

## 🎯 Key Design Decisions

### 1. **Backend-First Speech Processing**
**Decision**: Process speech-to-text on backend rather than client-side
**Rationale**: 
- Keeps API keys secure
- Enables server-side caching and optimization
- Better error handling and monitoring
- Easier rate limiting

### 2. **Radix UI for Components**
**Decision**: Use Radix UI primitives for complex components
**Rationale**:
- Accessibility out-of-the-box
- Unstyled, allowing full design control
- Comprehensive component set
- Battle-tested and maintained

### 3. **Vite over Create React App**
**Decision**: Use Vite as build tool
**Rationale**:
- Lightning-fast HMR (Hot Module Replacement)
- Better TypeScript support
- Smaller bundle sizes
- Modern tooling ecosystem

### 4. **React Hook Form**
**Decision**: Use React Hook Form for form state management
**Rationale**:
- Minimal re-renders
- Easy validation integration
- TypeScript support
- Better performance than alternatives

### 5. **Modular Service Architecture**
**Decision**: Separate concerns into service classes (WhisperService, AIParser, etc.)
**Rationale**:
- Better testability
- Reusability across components
- Easier maintenance
- Clear separation of concerns

### 6. **TypeScript Throughout**
**Decision**: Full TypeScript implementation
**Rationale**:
- Type safety reduces bugs
- Better IDE support
- Self-documenting code
- Easier refactoring

## ⚠️ Known Limitations

### Current Limitations

1. **Audio Format Support**
   - Limited to browser-supported formats (WebM, MP4, OGG)
   - 25MB file size limit
   - Requires modern browser with MediaRecorder API

2. **AI Processing**
   - Response quality depends on input clarity
   - May require refinement for complex forms
   - Token limits on large schemas
   - Rate limiting from Azure OpenAI

3. **Browser Compatibility**
   - Microphone access requires HTTPS (except localhost)
   - Some features require modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
   - No IE11 support

4. **Backend Dependency**
   - Requires backend server running for speech-to-text
   - No offline mode
   - Network latency affects user experience

5. **Form Complexity**
   - Very complex forms may need manual refinement
   - Limited to supported field types
   - Conditional logic may require manual configuration

6. **State Persistence**
   - No auto-save functionality
   - Form state lost on page refresh (no local storage yet)
   - No version history

## 🚀 Future Improvements

### Short-term

- [ ] **Auto-save functionality**: Periodic state saving to localStorage
- [ ] **Undo/Redo**: Add command pattern for history management
- [ ] **Form Templates Library**: Pre-built templates for common use cases
- [ ] **Collaborative Editing**: Multi-user real-time editing
- [ ] **Enhanced Export Options**: React Native, Vue, Angular components

### Medium-term

- [ ] **AI Model Training**: Fine-tune on form-specific datasets
- [ ] **Multi-language Support**: UI localization (i18n)
- [ ] **Advanced Validation**: Custom validation function builder
- [ ] **Integration Marketplace**: Connect to popular form backends (Formspree, Basin, etc.)
- [ ] **Component Theming**: Multiple design system presets
- [ ] **Analytics Dashboard**: Form usage and submission analytics

### Long-term

- [ ] **Desktop Application**: Electron wrapper for offline use
- [ ] **Form Analytics AI**: AI-powered insights on form performance
- [ ] **Visual Regression Testing**: Automated screenshot comparison
- [ ] **A/B Testing**: Built-in A/B testing for form variations
- [ ] **Form Builder SDK**: API for programmatic form generation
- [ ] **Mobile App**: Native mobile form builder

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Test Coverage
- Unit tests for utility functions
- Integration tests for API calls
- Component tests for React components
- E2E tests for critical user flows

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

### Environment Variables (Production)
```bash
VITE_BACKEND_URL=https://api.yourdomain.com
```

### Hosting Options
- **Vercel**: Recommended for Vite projects
- **Netlify**: Easy deployment with CI/CD
- **AWS S3 + CloudFront**: For enterprise deployments
- **Azure Static Web Apps**: Integrated with Azure backend

## 📚 Additional Documentation

- [Whisper Integration Guide](./WHISPER_INTEGRATION.md) - Detailed speech-to-text setup
- [Backend Configuration](./BACKEND_CONFIG.md) - Backend environment setup
- [Troubleshooting](./WHISPER_TROUBLESHOOTING.md) - Common issues and solutions
- [API Documentation](./docs/) - Complete API reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

Developed for the Hackathon Journey 360 (Phase 2)



---

**Made with ❤️ for Hackathon Journey 360**
  