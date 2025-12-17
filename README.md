# Convo

Convo is an open-source visual tool that helps programmers organize, inspect, and consolidate multi-turn prompts from LLM chat histories into reusable prompt artifacts.

## 🛠️ What it does

Convo allows users to import past LLM chat histories and interact with them visually:

- Extracts prompts into numbered nodes

- Organizes prompts in a 2D workspace

- Highlights redundancy and missing components

- Supports prompt consolidation and reuse

- Saves generated prompts in a reusable log

## Demo

Video Link: https://drive.google.com/file/d/1oO_w5WH79VW9iOEg0KGgV_Enkf1s9mEt/view?usp=sharing

## 📁 Repository Structure

```text
convo/
├── back_end/                 # Backend (Flask)
│   ├── app/
│   │   ├── routes/           # API route definitions
│   │   │   ├── classification.py
│   │   │   └── generate_prompt.py
│   │   ├── services/         # Core business logic
│   │   │   ├── classification_service.py
│   │   │   └── promptgen_service.py
│   │   └── utils/            # Configuration and helpers
│   │       └── config.py
│   ├── run.py                # Backend entry point
│   ├── test_env.py           # Environment test script
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Backend environment variables
│   └── venv/                 # Python virtual environment (local)
│
├── front_end/                # Frontend (React + TypeScript)
│   ├── components/           # UI components
│   ├── css/                  # Stylesheets
│   ├── src/                  # Frontend source code
│   ├── App.tsx               # Main React component
│   ├── index.tsx             # Frontend entry point
│   ├── index.html            # HTML template
│   ├── metadata.json         # App metadata
│   ├── package.json          # Frontend dependencies
│   ├── package-lock.json
│   ├── tsconfig.json         # TypeScript configuration
│   └── .env.local            # Frontend environment variables
│
├── .gitignore
└── README.md
```
## 🛠️ Development

### Prerequisites
- Node.js (v18+)
- npm
- (Optional) API key for an LLM provider (used for prompt consolidation)

### ▶️ Running the Project Locally

#### 1. Clone the Repository
```bash
git https://github.com/quynhho1601/convo_app.git
cd convo_app
```

#### 2. Start the Backend
```bash
cd back_end
conda activate <your-python-env>
python run.py 
```

#### 3. Start the Frontend
```bash
cd front_end
npm install
npm run dev
```

## 📂 Importing Chat Histories

Convo works with exported chat histories from common LLM platforms:

- **Claude**: [Settings → Privacy → Export data](https://support.claude.com/en/articles/9450526-how-can-i-export-my-claude-data) (official documentation)
- **ChatGPT**: [Settings → Data Controls → Export Data](https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data) (official OpenAI documentation)
- **Gemini**: [Share & export responses](https://support.google.com/gemini/answer/14184041) or use [Google Takeout](https://takeout.google.com/) (official Google documentation)

Paste the exported chat transcript into the Import Chat interface to begin.

## 🚀 How to Use

1. Import a multi-turn chat history
2. Use **Classification Mode** to filter relevant prompts
3. Organize prompts as nodes in the visual workspace
4. Use **Canvas Mode** to identify missing components
5. Select prompts and click **Create Ideas** to generate a consolidated prompt
6. Review and manage results in the **Prompt Log**

## 🤝 Contributing

This is an open-source project. Issues and pull requests are welcome!

## 📄 License

MIT License