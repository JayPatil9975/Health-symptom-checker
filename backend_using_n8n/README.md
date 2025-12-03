# 🧠 Backend - n8n AI Workflow

This folder contains the **n8n Workflow JSON** that powers the AI Health Symptom Checker. It acts as the backend API on n8n Cloud.

## 📂 Workflow Visualized

![n8n Workflow Graph](../assets/n8n-workflow.png)


## ⚙️ Architecture Flow
The workflow follows this linear logic:
1.  **Webhook Trigger:** Listens for POST requests.
### 1. Import the Workflow
1. Log in to your n8n Cloud account.
2. Create a new workflow.
3. Click the **Three Dots (Menu)** -> **Import from File**.
4. Upload `workflow.json`.

### 2. Configure Credentials
1. Double-click the **Google Gemini Chat Model** node.
2. Select **Create New Credential**.
3. Paste your Google Gemini API Key.

### 3. Connect Frontend
1. Open the **Webhook** node.
2. Copy the **Test URL**.
3. Paste this URL into `frontend/src/App.jsx` as the `API_URL`.
4. Click **Execute Workflow** in n8n to start listening for requests.