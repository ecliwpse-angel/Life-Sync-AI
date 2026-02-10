
# Team Synapse: Elastic Curriculum

4

## 🚀 Getting Started in VS Code

1. **Install Prerequisites**: Ensure [Node.js](https://nodejs.org/) (v18+) is installed.
2. **Setup Folder**: Open this project folder in VS Code.
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Environment Configuration**:
   - Copy `.env.example` to a new file named `.env`.
   - Add your [Gemini API Key](https://aistudio.google.com/app/apikey) to the `VITE_API_KEY` field.
5. **Start Development**:
   ```bash
   npm run dev
   ```
6. **Launch**: Click the local link (usually `http://localhost:3000`) in your terminal.

## 🛠 Project Structure
- `App.tsx`: Central hub for navigation and state management.
- `services/gemini.ts`: AI service layer using Gemini 3.
- `services/storage.ts`: Local persistent registry for user profiles.
- `components/`: Modular UI components (Visualizers, Chatbot, Onboarding).
- `types.ts`: TypeScript definitions for robust data handling.

## 🛡 Features
- **Elastic Curriculum**: Adaptive learning paths based on intensity and wellness.
- **Neural Alerts**: Automated and manual time-slot reminder system.
- **Advanced Assessment**: AI-generated "Probe" quizzes with high difficulty.
- **Academic Proctor**: Context-aware AI assistant for scholarly guidance.
