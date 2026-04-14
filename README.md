
# DSA Buddy – AI-Powered Data Structures & Algorithms Learning Platform

## Overview

DSA Buddy is a modern web application designed to streamline the process of learning Data Structures and Algorithms through structured guidance and AI-assisted interactions. The platform combines conversational AI, personalized roadmap generation, interactive quizzes, and notes creation into a unified learning experience.

The system is built using a frontend-centric architecture and leverages Backend-as-a-Service (BaaS) and external AI APIs to handle backend responsibilities.

---

## Key Features

### AI Chat Assistant

Enables users to ask questions related to DSA concepts and receive structured, contextual responses through an interactive chat interface.

### Personalized Roadmap Generator

Generates tailored learning paths based on user-selected goals and proficiency level, helping users follow a structured progression.

### Interactive Quiz System

Provides topic-based quizzes with answer evaluation to reinforce learning and assess understanding.

### Notes Generation and Export

Generates structured notes and allows users to export them as downloadable PDF documents.

### Authentication and Session Management

Handles user authentication securely using Supabase, including login, signup, and session persistence.

---

## Technology Stack

### Frontend

* React (v18)
* TypeScript
* Vite

### UI and Styling

* Tailwind CSS
* shadcn/ui
* Radix UI

### State Management

* TanStack React Query
* React Hooks

### Routing

* React Router

### Forms and Validation

* React Hook Form
* Zod

### Backend Services

* Supabase (Authentication and Database)

### Additional Libraries

* jsPDF (PDF generation)
* Recharts (data visualization)
* Vitest (testing)

---

## System Architecture

```mermaid
flowchart TD
    A[Client Application - React] --> B[State Layer - React Query and Hooks]
    B --> C[Service Layer]

    C --> D[Supabase Backend]
    C --> E[External AI APIs]

    D --> F[(Database)]
    D --> G[(Authentication)]

    E --> H[AI Processing Engine]

    H --> C
    C --> B
    B --> A
```

---

## Functional Flow

### Chat System

```mermaid
flowchart TD
    A[User Input] --> B[ChatInput Component]
    B --> C[API Request Triggered]
    C --> D[AI API Processing]
    D --> E[Response Received]
    E --> F[ChatMessage Component Renders Output]
```

---

### Roadmap Generation

```mermaid
flowchart TD
    A[User Selects Goal and Level] --> B[RoadmapBuilder Component]
    B --> C[Process Input or Call API]
    C --> D[Generate Roadmap Data]
    D --> E[GeneratedRoadmap Component Displays Result]
```

---

### Quiz System

```mermaid
flowchart TD
    A[User Starts Quiz] --> B[QuizStarter Component]
    B --> C[Load Questions]
    C --> D[Render Question]
    D --> E[User Submits Answer]
    E --> F[Evaluate Answer]
    F --> G{More Questions Available}

    G -->|Yes| D
    G -->|No| H[Display Final Results]
```

---

### Notes Generation and Export

```mermaid
flowchart TD
    A[User Requests Notes] --> B[Generate Notes via AI or Logic]
    B --> C[Display in NotesPanel]
    C --> D[User Initiates Export]
    D --> E[PDF Generated using jsPDF]
    E --> F[Download File]
```

---

### Authentication Flow

```mermaid
flowchart TD
    A[User Submits Credentials] --> B[Supabase Authentication]
    B --> C{Validation Result}

    C -->|Valid| D[Session Created]
    D --> E[Access Granted]

    C -->|Invalid| F[Error Returned]
```

---

## Project Structure

```
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
```

---

## Environment Configuration

Create a `.env` file in the root directory and define the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_AI_API_KEY=your_ai_api_key
```

---

## Setup and Installation

### Clone the repository

```
git clone <repository-url>
cd <project-folder>
```

### Install dependencies

```
npm install
```

### Start development server

```
npm run dev
```

### Build for production

```
npm run build
```

---

## Design Principles

* Modular component-based architecture
* Clear separation of concerns between UI and data handling
* API-driven communication model
* Scalable and maintainable frontend structure
* Backend abstraction using BaaS

---

## Limitations

* Direct API calls from frontend may expose sensitive keys
* Limited backend customization due to reliance on external services
* Performance dependent on third-party APIs

---

## Recommended Improvements

* Introduce a backend layer (Node.js or similar) for API proxying
* Implement secure key management
* Add role-based access control
* Enhance caching strategies and performance optimization
* Integrate logging and monitoring systems

---

## Use Cases

* Data Structures and Algorithms learning platforms
* AI-powered educational tools
* Developer portfolio projects
* EdTech SaaS applications

---

## License

This project is intended for educational and development purposes. It can be extended and customized based on requirements.

