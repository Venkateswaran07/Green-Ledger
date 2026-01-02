# EcoChain: Blockchain-Powered Carbon Intelligence Ledger

EcoChain (commercially known as **Green Ledger**) is a world-class supply chain transparency platform. It combines **Immutable Blockchain Technology**, **AI-Powered Carbon Auditing**, and **Real-time Analytics** to verify environmental claims and calculate the true carbon footprint of industrial batches from raw material to final dispatch.

## 🚀 Key Features

### 1. Immutable Blockchain Ledger
Every stage of the supply chain is recorded as a "Block" in a cryptographic chain.
- **SHA-256 Hashing**: Ensures data integrity; tampering with any previous stage invalidates the entire chain.
- **Genesis to Dispatch**: Tracks 7+ stages per industrial domain (Roasting, Mixing, Fermentation, Extraction, Assembly).

### 2. Carbon Intelligence Engine
Automated calculation of CO₂e (Carbon Dioxide Equivalent) based on industrial telemetry.
- **Energy Intensity**: Monitors kWh usage per machine and applies sector-specific emission factors.
- **Thermal Processing**: Factors in energy spikes for high-temperature transformations.
- **Logistics Impact**: Calculates footprint based on transport distance and mass.
- **Efficiency Grading**: Rewards low-scrap, high-efficiency operations with carbon "rebates."

### 3. Gemini AI Verification (GreenTrust AI)
Powered by Google Gemini 3 Flash, the system performs a neural audit on every entry.
- **Anomaly Detection**: Identifies unrealistic data (e.g., impossible energy/mass ratios).
- **Trust Scoring**: Assigns an integrity percentage to every batch.
- **Suggestions**: Provides AI-driven advice on how to reduce emissions in the next batch.

### 4. Professional Certification & QR Verification
- **Digital Certificates**: Generates a professional, print-ready "Carbon Integrity Certificate."
- **Scan-to-Verify**: QR codes lead directly to a public **Batch Carbon Calculator**, allowing consumers to audit the mathematical proof of the product's footprint.

### 5. Advanced Analytics Dashboard
- **Carbon Accretion Trends**: Visualizes how carbon "accumulates" through the supply chain.
- **Sustainability Matrix**: Compares production impact against AI trust scores.
- **Admin Oversight**: Allows system administrators to monitor global ecosystem sustainability.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI Engine**: Google GenAI SDK (@google/genai) — Gemini 3 Flash
- **Cryptography**: Web Crypto API (SubtleCrypto)
- **Visuals**: Recharts (Professional Industrial Analytics)
- **Icons**: Lucide React
- **Verification**: QR Server API

---

## ⚙️ Configuration

The app requires a Google Gemini API Key to enable the AI Auditor and Chatbot features.

1. Obtain an API Key from [Google AI Studio](https://aistudio.google.com/).
2. Set the environment variable:
   ```env
   API_KEY=your_gemini_api_key_here
