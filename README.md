# 🩺 AI-Powered Medical Assistant Portal

The **Medical Assistant Portal** is a web application that helps users find the right doctor based on their symptoms.  
It uses a **trained AI model (via Ollama)** for symptom-to-disease prediction and specialist recommendation.  
The app also integrates **Google Maps API** to show nearby doctors.

---

## 🚀 Features
- Symptom-based disease prediction  
- Specialist doctor recommendations  
- Google Maps integration for nearby doctors  
- Clean, responsive UI (React + Tailwind)  
- Backend API (Django/Flask) for AI model inference  
- PostgreSQL database for storing doctor and patient data  

---

## 📂 Project Structure
med_assistant_portal/
│── backend/ # Django/Flask backend
│ ├── models/ # Database models
│ ├── routes/ # API endpoints
│ ├── ollama_inference/ # AI model integration
│ └── ...
│
│── frontend/ # React frontend
│ ├── src/
│ │ ├── components/ # Navbar, Footer, etc.
│ │ ├── pages/ # UI pages (Home, Predict, About)
│ │ └── api.js # Axios API calls
│ └── ...
│
│── dataset/ # Training dataset (symptoms → disease → doctor)
│── docs/ # Diagrams, synopsis, reports
│── README.md # Project documentation
│── requirements.txt # Python dependencies
│── package.json # Frontend dependencies


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/med_assistant_portal.git
cd med_assistant_portal

cd backend
python -m venv venv
source mca/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt


Run the backend Django server
python manage.py runserver   # Django

Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev



Run your trained model:

ollama run med-assist-model

```
4️⃣ Running Ollama Model

Make sure Ollama is installed:
Download Ollama -https://ollama.com/download/windows
