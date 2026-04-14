DSA Buddy – AI-Powered Learning Platform
Overview

DSA Buddy is a modern, AI-driven web application designed to assist users in learning Data Structures and Algorithms through personalized roadmaps, interactive quizzes, AI chat assistance, and structured notes generation.

The application follows a frontend-centric architecture using a Backend-as-a-Service model, integrating external AI APIs and Supabase for authentication and persistence.

Core Features
1. AI Chat Assistant
Accepts user queries related to DSA
Sends requests to an external AI API
Displays structured responses in a conversational UI
2. Roadmap Generator
Generates personalized DSA learning paths
Adapts based on user-selected goals and levels
Displays structured progression (topics, sequence, milestones)
3. Quiz System
Interactive quiz interface
Tracks answers and progression
Evaluates user understanding
4. Notes Generator and Export
Generates structured notes
Allows export to PDF using jsPDF
5. Authentication System
User login/signup handled via Supabase
Session management included
Technology Stack
Frontend
React (v18)
TypeScript
Vite
UI and Styling
Tailwind CSS
shadcn/ui
Radix UI
Lucide Icons
State and Data Management
TanStack React Query
React Hooks
Routing
React Router
Forms and Validation
React Hook Form
Zod
Backend (BaaS)
Supabase
Authentication
Database
Storage (optional)
Additional Libraries
jsPDF (PDF export)
Recharts (data visualization)
Vitest (testing)
Project Structure
root/
│
├── public/
├── src/
│   ├── components/
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── QuizStarter.tsx
│   │   ├── QuizQuestion.tsx
│   │   ├── RoadmapBuilder.tsx
│   │   ├── GeneratedRoadmap.tsx
│   │   ├── NotesPanel.tsx
│   │
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── App.tsx
│   ├── main.tsx
│
├── .env
├── package.json
├── vite.config.ts
Application Architecture
High-Level Architecture
[ User Interface (React) ]
           │
           ▼
[ State Management (React Query + Hooks) ]
           │
           ▼
[ External Services Layer ]
   ├── Supabase (Auth + DB)
   └── AI APIs (Chat / Roadmap / Notes)
Functional Flowcharts
1. Chat Flow
User Input
   │
   ▼
ChatInput Component
   │
   ▼
API Request (AI Service)
   │
   ▼
Response प्राप्त
   │
   ▼
ChatMessage Component Render
2. Roadmap Generation Flow
User Selects Goal + Level
   │
   ▼
RoadmapBuilder Component
   │
   ▼
Processing Logic / API Call
   │
   ▼
Generated Roadmap Data
   │
   ▼
GeneratedRoadmap Component Render
3. Quiz Flow
User Starts Quiz
   │
   ▼
QuizStarter Component
   │
   ▼
Question Rendering (QuizQuestion)
   │
   ▼
User Answer Submission
   │
   ▼
Answer Evaluation
   │
   ▼
Next Question / Result
4. Notes Generation and Export Flow
User Requests Notes
   │
   ▼
Notes Generated (AI / Logic)
   │
   ▼
Displayed in NotesPanel
   │
   ▼
User Clicks Export
   │
   ▼
jsPDF Generates File
   │
   ▼
Download PDF
5. Authentication Flow
User Signup/Login
   │
   ▼
Supabase Auth सेवा
   │
   ▼
Session Token Generated
   │
   ▼
User Access Granted
Environment Configuration

Create a .env file in the root directory:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_AI_API_KEY=your_ai_api_key
Installation and Setup
Step 1: Clone Repository
git clone <repository-url>
cd project-folder
Step 2: Install Dependencies
npm install
Step 3: Run Development Server
npm run dev
Step 4: Build for Production
npm run build
Key Design Patterns
Component-Based Architecture
Modular UI components
Reusable and scalable design
Hooks-Based State Management
Local state using React hooks
Server state using React Query
API Abstraction
Centralized service handling
Clean separation between UI and data logic
BaaS Integration
No custom backend
Supabase handles backend responsibilities
Important Observations
No traditional backend (Node.js, Django, PHP)
Fully frontend-driven logic
External APIs handle AI processing
Scalable SaaS-ready architecture
Limitations
Direct API calls from frontend (security concern for production)
Limited server-side control
Dependency on third-party services
Possible Improvements
Add custom backend (Node.js / Express)
Implement API proxy layer
Add role-based access control
Improve caching and offline support
Add analytics and tracking
Use Cases
DSA learning platforms
EdTech SaaS products
AI-powered tutoring systems
Developer portfolio projects
License

This project is intended for educational and development purposes. Modify and extend as needed.
