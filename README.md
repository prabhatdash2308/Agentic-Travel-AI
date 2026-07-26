# 🦅 Eagle Agentic AI

> **An autonomous multi-agent travel planning platform powered by Agentic AI, LangGraph, FastAPI, and React.** Eagle intelligently coordinates multiple AI agents to research, optimize, and generate personalized travel itineraries through collaborative reasoning.

<p align="center">
  <a href="https://agentic-travel-ai.vercel.app/"><strong>🚀 Live Demo</strong></a> •
  <a href="https://github.com/prabhatdash2308/Agentic-Travel-AI"><strong>GitHub</strong></a>
</p>

---

## ✨ Features

- 🤖 Multi-Agent AI Architecture
- 🧠 Autonomous Task Orchestration using LangGraph
- ✈️ Smart Travel Itinerary Generation
- 🏨 Hotel & Accommodation Planning
- 🚕 Transportation Recommendations
- 🍽 Dining & Activity Suggestions
- 💰 Budget-Aware Planning
- 📅 Day-wise Travel Scheduling
- 🌙 Dark / Light Theme
- ⚡ Fast, Responsive Modern UI
- 🔗 RESTful API Architecture

---

## 🏗️ Architecture

```text
                    User
                      │
                      ▼
          React + TypeScript (Frontend)
                      │
                 REST API
                      │
                      ▼
              FastAPI Backend
                      │
              LangGraph Workflow
                      │
 ┌──────────┬──────────┬──────────┬──────────┐
 ▼          ▼          ▼          ▼
Destination Flight    Hotel     Dining
 Agent      Agent     Agent      Agent
        ▼         ▼         ▼
   Budget Agent  Transport Agent
                │
                ▼
      Personalized Travel Plan
```

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Python
- FastAPI
- LangGraph
- LangChain
- SQLAlchemy
- SQLite
- Uvicorn
- Pydantic

### AI
- Google Gemini
- LangGraph
- Multi-Agent Workflows
- Prompt Engineering

### Deployment
- **Frontend:** Vercel
- **Backend:** Render

---

## 📂 Project Structure

```text
Agentic-Travel-AI
│
├── apps
│   ├── frontend
│   └── backend
│
├── README.md
└── LICENSE
```

---

## 🚀 Live Demo

🌐 **Frontend:** https://agentic-travel-ai.vercel.app/

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/prabhatdash2308/Agentic-Travel-AI.git

cd Agentic-Travel-AI
```

---

### Backend

```bash
cd apps/backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend:

```
http://localhost:8000
```

API Docs:

```
http://localhost:8000/docs
```

---

### Frontend

```bash
cd apps/frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend

```env
GOOGLE_API_KEY=your_api_key
DATABASE_URL=your_database_url
```

### Frontend

```env
VITE_API_URL=http://localhost:8000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Health Check |
| POST | `/chat` | AI Chat |
| POST | `/workflow` | Execute Travel Workflow |
| GET | `/status` | Workflow Status |

---

## 💡 Example Prompt

```text
Plan a 5-day trip to Japan for two people with a budget of $2500 including flights, hotels, sightseeing, transportation, and local food.
```

---

## 🚀 Future Roadmap

- Flight API Integration
- Hotel Booking APIs
- Weather Intelligence
- Maps & Navigation
- Calendar Sync
- Voice Assistant
- Mobile Application
- AI Memory
- Cost Prediction
- Multi-language Support

---

## 📚 What We Built

- Autonomous Multi-Agent AI System
- Intelligent Workflow Orchestration
- AI-powered Travel Planning
- Modern Full-Stack Architecture
- Responsive User Experience
- Production-ready REST API

---

## 👨‍💻 Developer

**Prabhat Dash**

- GitHub: https://github.com/prabhatdash2308

**Aryan Gupta**

- Github: https://github.com/aryanrgupta03-spec

**Ananya Chaudhary**
- Github: https://github.com/ananyyaaaa178-coder
  
- Live Demo: https://agentic-travel-ai.vercel.app/

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

### ⭐ If you like this project, consider giving it a Star!

**Built with ❤️ using Agentic AI, LangGraph, FastAPI & React**

</div>
