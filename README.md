DSA Buddy – AI-Powered Learning Platform
Overview

DSA Buddy is a web-based application designed to support structured learning of Data Structures and Algorithms through AI-assisted interactions, guided roadmaps, quizzes, and notes generation.

The system follows a frontend-driven architecture, integrating third-party services for authentication, persistence, and AI-based processing.

Core Capabilities
AI-assisted chat for DSA queries
Personalized roadmap generation based on user goals
Interactive quiz system for practice and evaluation
Notes generation with export functionality
Authentication and session handling
Technology Stack
Frontend
React (v18)
TypeScript
Vite
UI Layer
Tailwind CSS
shadcn/ui
Radix UI
State and Data Handling
React Query (TanStack)
React Hooks
Routing
React Router
Forms and Validation
React Hook Form
Zod
Backend Services
Supabase (Authentication and Database)
Supporting Libraries
jsPDF (PDF export)
Recharts (visualization)
Vitest (testing)
System Architecture
flowchart TD
    A[Client - React Application] --> B[State Layer - React Query and Hooks]
    B --> C[Service Layer]

    C --> D[Supabase Backend]
    C --> E[AI Processing APIs]

    D --> F[(Database)]
    D --> G[(Authentication)]

    E --> H[AI Response Engine]

    H --> C
    C --> B
    B --> A
Application Flow
Chat Interaction Flow
flowchart TD
    A[User enters query] --> B[ChatInput Component]
    B --> C[Request sent to API]
    C --> D[AI processes input]
    D --> E[Response received]
    E --> F[ChatMessage renders output]
Roadmap Generation Flow
flowchart TD
    A[User selects goal and level] --> B[RoadmapBuilder]
    B --> C[Input processing]
    C --> D[Generate roadmap data]
    D --> E[GeneratedRoadmap displays result]
Quiz Execution Flow
flowchart TD
    A[Quiz initiated] --> B[QuizStarter]
    B --> C[Load questions]
    C --> D[Render question]
    D --> E[User submits answer]
    E --> F[Evaluate answer]
    F --> G{Remaining questions}

    G -->|Yes| D
    G -->|No| H[Display result summary]
Notes Generation and Export
flowchart TD
    A[User requests notes] --> B[Generate content]
    B --> C[Display in NotesPanel]
    C --> D[Export triggered]
    D --> E[PDF generation via jsPDF]
    E --> F[File download]
Authentication Flow
flowchart TD
    A[User submits credentials] --> B[Supabase Auth]
    B --> C{Validation}

    C -->|Valid| D[Session created]
    D --> E[Access granted]

    C -->|Invalid| F[Error returned]
Project Structure
src/
│
├── components/
│   ├── ChatInput.tsx
│   ├── ChatMessage.tsx
│   ├── QuizStarter.tsx
│   ├── QuizQuestion.tsx
│   ├── RoadmapBuilder.tsx
│   ├── GeneratedRoadmap.tsx
│   ├── NotesPanel.tsx
│
├── pages/
├── hooks/
├── services/
├── lib/
│
├── App.tsx
├── main.tsx
Configuration

Create a .env file in the root directory:

VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_AI_API_KEY=your_api_key
Setup Instructions
Install dependencies
npm install
Start development server
npm run dev
Build for production
npm run build
Design Approach
Component-based modular structure
Separation of UI and data logic
API-driven architecture
Backend abstraction using BaaS
Scalable frontend design
Observations
No dedicated custom backend layer
Direct integration with external APIs
Frontend handles orchestration of logic
Suitable for rapid prototyping and SaaS foundations
Limitations
API keys exposed at frontend level (requires mitigation for production)
Limited control over backend logic
Dependency on third-party services
Potential Enhancements
Introduce a backend layer (Node.js or similar)
Add role-based access control
Implement API gateway or proxy
Improve caching and performance optimization
Add analytics and monitoring
Use Cases
Learning platforms focused on DSA
AI-based tutoring systems
Developer portfolio projects
EdTech SaaS products
License

Intended for educational and development use. Can be extended or modified as required.
