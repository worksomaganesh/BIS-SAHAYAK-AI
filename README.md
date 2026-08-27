# 🇮🇳 BIS Sahayak AI — Regulatory Decision Support System

> **Smart India Hackathon (SIH) Problem Statement ID:** `SIH26107`  
> **Domain:** Bureau of Indian Standards (BIS) / Ministry of Consumer Affairs, Food & Public Distribution  
> **Core Archetype:** Document-Grounded, Citation-First Regulatory Assistant, Standards Directory, Comparator & Compliance Dossier Synthesis Engine.

---

## 📌 Executive Summary

**BIS Sahayak AI** is an enterprise-grade AI decision-support copilot designed for Indian MSMEs, factory quality managers, startups, and consumers navigating the Indian Standards (IS) compliance ecosystem. 

Rather than relying on generic, ungrounded Large Language Models that hallucinate standard clauses or fee amounts, BIS Sahayak AI operates on a **deterministic, citation-first RAG (Retrieval-Augmented Generation) pipeline** backed by verified Bureau of Indian Standards documents, Gazette Quality Control Orders (QCOs), and Scheme of Testing & Inspection (STI) manuals.

### ⏱️ The 2-Minute Jury Pitch
> *"Over 90% of Indian MSME entrepreneurs struggle to identify whether their manufactured product falls under a mandatory Quality Control Order (QCO) or a voluntary standard. Navigating multi-tiered certification schemes (Scheme-I ISI Mark, Scheme-II CRS, FMCS, Hallmarking) often costs businesses lakhs of rupees in uncoordinated consultant fees and delayed production launches.*
>
> *BIS Sahayak AI solves this in seconds: An entrepreneur can speak or type in English, Telugu, or Hindi. The platform instantly identifies the exact IS specification, explains mandatory testing parameters (microbiological, chemical, mechanical), calculates statutory licensing and audit budgets with official 50%/20% MSME concessions, compares competing standards side-by-side, and generates an official, printable A4 Compliance Dossier ready for board members and bank loan officers—with 100% verified citations to official BIS portals."*

---

## 🏛️ System Architecture

```
                                  ┌────────────────────────────────┐
                                  │      User Input Layer          │
                                  │  (Text / Web Speech STT API)   │
                                  │    English / Telugu / Hindi    │
                                  └───────────────┬────────────────┘
                                                  │
                                                  ▼
                                  ┌────────────────────────────────┐
                                  │    Context & Intent Router     │
                                  │ (Pre-prompting & Token Normal) │
                                  └───────────────┬────────────────┘
                                                  │
                                                  ▼
                        ┌────────────────────────────────────────────────────┐
                        │        Hybrid Retrieval-Augmented Engine (RAG)     │
                        ├────────────────────────────────────────────────────┤
                        │ • Deterministic Exact-Match IS Clause Lookup       │
                        │ • Cosine / Semantic Keyword Density Matcher        │
                        │ • Gazette QCO & STI Annexure Rule Mapper           │
                        └─────────────────────────┬──────────────────────────┘
                                                  │ Grounded Context
                                                  ▼
                                  ┌────────────────────────────────┐
                                  │      Server-Side AI Layer      │
                                  │ (Gemini 2.5 Server-Side Proxy) │
                                  │   Strict Grounding & Citation  │
                                  └───────────────┬────────────────┘
                                                  │
                                                  ▼
                        ┌────────────────────────────────────────────────────┐
                        │            Client-Side Presentation Layer          │
                        ├────────────────────────────────────────────────────┤
                        │ 1. Conversational Guidance with Inline Citations   │
                        │ 2. 4-Phase Actionable Compliance Checklists        │
                        │ 3. Interactive Standards Directory & Filters       │
                        │ 4. Side-by-Side Standards Comparator               │
                        │ 5. Indicative Fee & MSME Concession Estimator      │
                        │ 6. A4 Printable Compliance Dossier Generator (PDF) │
                        │ 7. Jury Diagnostic & Knowledge Base Telemetry      │
                        └────────────────────────────────────────────────────┘
```

---

## ✨ Key Capabilities & Modules

### 1. 🌟 Structured 6-Block Welcome Portal
- **Zero-Friction Discovery**: Instant access to standard search, voice query, standards comparison, and fee estimation.
- **Enterprise Visuals**: High-contrast layout, 3D hologram seal, and domain-authentic design.

### 2. 🗣️ Vernacular & Multilingual Voice Assistant
- **Trilingual Support**: Full dynamic localization in **English**, **తెలుగు (Telugu)**, and **हिन्दी (Hindi)**.
- **Web Speech API Integration**: Real-time microphone dictation for seamless vernacular accessibility by regional manufacturers.
- **Speech Synthesis (TTS)**: Clean auditory playback of compliance guidance.

### 3. 🔍 Standards Directory & Smart Filtering
- **Comprehensive Knowledge Index**: Pre-indexed standards including:
  - `IS 14543:2024` — Packaged Drinking Water (Compulsory ISI Mark)
  - `IS 10500:2012` — Drinking Water Specification (Piped/Potable)
  - `IS 269:2015` — Ordinary Portland Cement (OPC 33, 43, 53 Grade)
  - `IS 1489 (Part 1):2015` — Portland Pozzolana Cement (Fly Ash Based)
  - `IS 1786:2008` — High Strength Deformed Steel Bars (TMT Fe 500D / Fe 550D)
  - `IS 1417:2016` — Gold and Gold Alloys Jewellery / Hallmarking (HUID)
  - `IS 13252 (Part 1):2010` — Information Technology Equipment Safety (CRS)
  - `IS 9873 (Part 1):2019` — Safety of Toys (Mechanical & Physical Properties)
- **Instant Search**: Filter by Sector, Mandatory QCO Status, Certification Scheme, or Product Keywords.

### 4. ⚖️ Side-by-Side Standards Comparator
- Dual dynamic selectors with instant presets (`IS 14543 vs IS 10500`, `IS 269 vs IS 1489`, etc.).
- Matrix comparing Scope, QCO Mandate, Certification Schemes, Laboratory STI Requirements, and Direct Portal Links.

### 5. 💰 Indicative Fee & MSME Concession Estimator
- Real-time statutory budget calculator factoring in:
  - **Enterprise Category**: Micro / Women (50% concession), Small MSME (20% concession), Medium/Large.
  - **Scheme Selection**: Scheme-I (ISI Mark), Scheme-II (CRS), FMCS (Foreign), Hallmarking.
  - **Itemized Breakdown**: Application fees, Auditor man-days, Sample testing estimates, Minimum Marking Fee advances, and 18% GST.
  - **One-Click Copy & AI Consultation** triggers.

### 6. 📑 Export Official Compliance Dossier (PDF / Print Report)
- Generates a formal, printable A4 compliance dossier containing:
  - Document Reference ID and Dynamic Security Verification Hash (`SHA256:BIS-DS-...`).
  - Standard Identification Matrix & Gazette References.
  - Mandatory STI Testing Schedule with frequency and tolerance benchmarks.
  - Interactive & printable 4-phase audit readiness checklist.
  - Legal safety disclaimers and verified `manakonline.in` portal links.
  - Zero-dependency native `@media print` formatting for cross-browser PDF generation.

### 7. ⚡ Jury Mode & Diagnostic Telemetry Drawer
- Dedicated inspection drawer (`⚡` button in header) allowing evaluators to:
  - Test pre-configured edge case scenarios (Hallmarking, Water, Cement, IT Equipment).
  - Inspect in-memory RAG grounding chunks and similarity thresholds.
  - Switch simulated user personas (MSME Entrepreneur, Quality Assurance Chemist, Consumer).

---

## 🚀 Local Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**

### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/bis-sahayak-ai.git
cd bis-sahayak-ai
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file at the root:
```env
# Optional Gemini API Key for dynamic natural language expansions
# If absent, the app gracefully operates on its rich deterministic knowledge base
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Build for Production
```bash
npm run build
```

---

## 🎬 Live Presentation Script (Step-by-Step Demo Flow)

| Step | Time | View / Action | Script & Key Talking Point |
| :--- | :--- | :--- | :--- |
| **1. Introduction** | 0:00 - 0:25 | **Welcome View** | Introduce the problem statement `SIH26107`. Highlight how Indian MSMEs struggle with complex Gazette QCOs and high consultant costs. |
| **2. Multilingual Query** | 0:25 - 0:50 | **Chat View (Voice / Telugu)** | Switch language to Telugu (`తెలుగు`) or Hindi (`हिन्दी`). Use the microphone or click preset: *"What is the standard for packaged drinking water?"*. Demonstrate instantaneous citation-grounded response for `IS 14543:2024`. |
| **3. Standards Comparator** | 0:50 - 1:15 | **Comparator Tab** | Open the Comparator and select `IS 14543 vs IS 10500`. Explain how packaged water requires mandatory factory ISI licensing while tap water is a municipal benchmark. |
| **4. Fee Estimation** | 1:15 - 1:35 | **Fee Estimator Tab** | Select **Micro / Women Enterprise**. Show the statutory 50% discount automatically applied to the ₹1,000 application fee and ₹7,000 auditor man-day charge. |
| **5. PDF Dossier Export** | 1:35 - 1:55 | **Dossier Modal** | Click **"📥 Export Official Dossier (PDF)"**. Show the A4 printable document with verification hashes, STI testing tables, and printable checkable roadmap. Click Print / Save PDF. |
| **6. Jury Telemetry** | 1:55 - 2:00 | **Jury Drawer (`⚡`)** | Open the Diagnostic panel to showcase the transparent RAG grounding chunks and zero hallucination guarantee. |

---

## 🛡️ Reliability & Error Prevention Safeguards
- **Global Error Boundary**: All React components wrapped in `ErrorBoundary.tsx` to ensure zero uncaught crashes.
- **Offline Fallback Guarantee**: If external LLM APIs experience rate-limits or network drops, the application falls back immediately to its deterministic local knowledge engine.
- **Legal Compliance**: Explicit statutory disclaimers clearly state that all official applications must be completed on `manakonline.in`.

---

## 👥 Contributors & Hackathon Team
- **Project:** BIS Sahayak AI (SIH26107)
- **Built for:** Smart India Hackathon

*Bureau of Indian Standards (BIS) — Dedicated to Quality, Safety, and National Consumer Trust.*
