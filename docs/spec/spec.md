# Software Requirement Specification (SRS): MemoryOS

**Version:** 1.0.0
**Status:** Final Draft
**Authors:** Product Management & CTO Office
**Date:** May 2026

---

## 1. Executive Summary
MemoryOS is a "Private Personal Memory Operating System." Unlike traditional note-taking apps that act as archives, MemoryOS is a **living synthesis engine**. It uses local-first AI to turn a user's stream-of-consciousness chat input into a searchable, relational, and proactive second brain. The core value proposition is **"Zero-Knowledge, High-Context Memory."**

---

## 2. Product Strategy (PM Perspective)

### 2.1 The Problem Space
* **The Archive Trap:** Traditional notes are easy to write but hard to retrieve contextually.
* **Privacy Paranoia:** Users are increasingly wary of feeding personal thoughts into cloud-based LLMs.
* **High Input Friction:** Formal journaling feels like a chore, leading to high churn.

### 2.2 The Solution
* **Chat-Native:** Lowers the barrier to entry to zero.
* **Proactive Retrieval:** The app doesn't just wait for questions; it surfaces patterns.
* **Privacy as a Moat:** All semantic processing happens on the "edge" (the device).

---

## 3. Functional Requirements

### 3.1 Core Features
* **Unified Ingestion:** Support for text, voice-to-text (Whisper), and image-to-text.
* **Semantic Querying:** Natural language "Ask your past self" interface.
* **Proactive Insights:** Weekly "Memory Synthesis" reports identifying recurring themes or mood shifts.
* **Temporal Navigation:** A visual timeline of "Mental Milestones."

### 3.2 User Personas
1.  **The High-Performer:** Needs to recall past decisions and project context instantly.
2.  **The Lifelong Learner:** Stores snippets of knowledge to be resurfaced during relevant tasks.
3.  **The Reflective Journaler:** Uses the app for emotional processing and pattern recognition.

---

## 4. Technical Specification (CTO Perspective)

### 4.1 Technical Stack
| Layer | Technology | Selection Rationale |
| :--- | :--- | :--- |
| **Framework** | React Native (Expo) | Cross-platform reach with JSI access for high-performance C++ modules. |
| **Local Database** | WatermelonDB | Observable, lazy-loading, and optimized for high-volume offline data. |
| **Vector Engine** | LanceDB (Embedded) | Serverless vector DB that lives on-disk; handles HNSW indexing efficiently. |
| **AI Inference** | Transformers.js / ONNX | Runs embeddings (`all-MiniLM-L6-v2`) and small LLMs directly in WASM. |
| **Encryption** | AES-256-GCM | Hardware-backed key management via iOS Keychain/Android Keystore. |

### 4.2 System Architecture
1.  **Ingestion:** User inputs text -> On-device Whisper (if voice) -> Local Encryption -> Primary SQL Store.
2.  **Vectorization:** Background worker generates 384-dim embeddings -> Upsert to LanceDB.
3.  **Retrieval (RAG):** User asks "What did I think about X?" -> Vector Search -> Context Retrieval -> Local LLM Synthesis -> Response.

---

## 5. Security & Privacy Schema

* **Zero-Knowledge Architecture:** The application server never sees the user's raw text or decryption keys.
* **Local-First Sync:** Optional E2EE sync using CRDTs (Conflict-free Replicated Data Types) for multi-device support without centralizing data.
* **Privacy Audit Logs:** A transparent UI section showing every outbound network request.

---

## 6. Roadmap & Milestones

### Phase 1: Foundation (Weeks 1-4)
* Setup WatermelonDB + LanceDB integration.
* Implement local vectorization (WASM).
* MVP Chat UI for text input.

### Phase 2: Intelligence (Weeks 5-8)
* Integration of local LLM (Gemma-2B/Phi-3.5) for summarization.
* Voice-to-text (Whisper) optimization.
* Alpha testing of "Ask your past self."

### Phase 3: Proactivity (Weeks 9-12)
* Engine for "Recurring Theme" detection.
* Multi-device E2EE sync.
* Public Beta Launch.

---

## 7. Key Success Metrics (KPIs)
* **Daily Input Frequency:** Target >2 entries per day.
* **Query Success Rate:** Qualitative measure of AI response accuracy to past events.
* **On-Device Latency:** Vector search + LLM response must be <3 seconds on mid-tier devices.
