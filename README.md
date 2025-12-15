# Prompto

Prompto is an open-source visual tool that helps programmers organize, inspect, and consolidate multi-turn prompts from LLM chat histories into reusable prompt artifacts.

## 🛠️ What it does

Prompto allows users to import past LLM chat histories and interact with them visually:

- Parses multi-turn chat transcripts into individual prompt nodes

- Displays prompts in a two-dimensional workspace with turn numbering

- Visually distinguishes redundant and non-duplicate prompts

- Provides a structured canvas to assess prompt completeness

- Enables prompt consolidation into concise, reusable instructions

- Maintains a prompt log for review, download, and sharing


## 🛠️ Development

### Prerequisites
- Node.js (v18+)
- npm
- (Optional) API key for an LLM provider (used for prompt consolidation)

### ▶️ Running the Project Locally

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/prompto.git
cd prompto
```

#### 2. Start the Backend
```bash
cd back_end
conda activate <your-python-env>
python run.py 
```

#### 3. Start the Frontend
```bash
cd client
npm install
npm run dev
```

### Local URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 📂 Importing Chat Histories

Prompto works with exported chat histories from common LLM platforms:

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