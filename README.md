# 🚢 PortFlow: AI-Powered Digital Clearing Agent for Lagos Ports

![PortFlow Banner](assets\PortFlowImage.png)

> **Built for the Agentic AI Hackathon with IBM watsonx Orchestrate**

PortFlow is an intelligent orchestration agent designed to revolutionize cargo clearance operations at Lagos ports. By leveraging **IBM watsonx Orchestrate**, it automates the complex, multi-step process of clearing containers—from document validation to customs payment and final release—reducing delays, corruption risks, and manual overhead.

---

## 🌍 The Challenge

Cargo clearance in Nigerian ports is often plagued by:

- **Opacity**: Importers struggle to know the real-time status of their goods.
- **Inefficiency**: Manual coordination between Customs, Shipping Lines, and Port Authorities leads to demurrage charges.
- **Complexity**: Navigating the regulatory landscape requires expert knowledge that many lack.

## 💡 The Solution

PortFlow acts as a **Digital Clearing Agent**. It doesn't just "chat"; it **acts**. It connects to port systems, validates documents, calculates duties, and schedules inspections autonomously, guided by human oversight only when necessary.

### Key Features

- **📄 Intelligent Document Processing**: Automatically validates Bills of Lading and extracts critical cargo data.
- **🤖 Autonomous Workflow Orchestration**: Manages the entire lifecycle:
  - Validation → Customs Check → Duty Payment → Shipping Release → Inspection → Final Gate Pass.
- **💰 Financial Transparency**: Instantly calculates duties in Nigerian Naira (₦) and processes payments securely.
- **🔍 Real-Time Status Tracking**: Proactively checks status across Customs, Shipping Lines, and NPA (Nigerian Ports Authority).
- **💬 Natural Language Interface**: Users interact with the agent naturally to ask "Where is my container?" or "Pay my duties."

---

## 🧠 Powered by IBM watsonx Orchestrate

PortFlow is built on the **IBM watsonx Orchestrate** platform, utilizing its agentic capabilities to perform real-world tasks.

### How We Use It

1. **Agent Definition**: We defined a custom agent (`portflow-agent`) specialized in Nigerian port logistics.
2. **LLM Brain**: The agent uses **`llama-3-2-90b-vision-instruct`** to understand complex user intents and reason through the clearance process.
3. **Custom Skills (Tools)**: We built a suite of Python-based tools that the agent uses to interact with our backend systems:
   - `validate_container`: Checks document integrity.
   - `check_customs_status`: Queries customs databases for duty assessments.
   - `pay_customs_duty`: Executes payment transactions (with user confirmation).
   - `schedule_inspection`: Books physical examination slots with the NPA.
   - `release_container`: Issues the final gate pass.

### Architecture

The solution consists of:

- **Frontend**: A modern Next.js dashboard for users to upload documents and chat with the agent.
- **Backend**: A Django API that simulates the various port authority systems (Customs, Shipping Lines, NPA).
- **Orchestration Layer**: IBM watsonx Orchestrate manages the state and execution of tools based on the conversation.

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- IBM Cloud Account with watsonx Orchestrate access

### 1. Backend Setup (Django)

```bash
cd PortFlow-Backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt
cd portflow-agent
python manage.py migrate
python manage.py runserver
```

### 2. Frontend Setup (Next.js)

```bash
cd Portflow-Frontend/portflow
npm install
npm run dev
```

### 3. Access the App

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 💼 Business Value

- **For Importers**: Reduces clearance time from weeks to days. Eliminates demurrage costs.
- **For Authorities**: Increases compliance and revenue collection transparency.
- **For the Economy**: Streamlines trade facilitation in one of Africa's busiest maritime hubs.

---

## 🛠️ Tech Stack

- **AI Orchestration**: IBM watsonx Orchestrate
- **Model**: Llama 3.2 90B Vision Instruct
- **Frontend**: Next.js, Tailwind CSS, TypeScript
- **Backend**: Python, Django, SQLite
- **Integration**: REST APIs

---

_Submitted by Team Ubuntu Labs for the Agentic AI Hackathon 2025._
