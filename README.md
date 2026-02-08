# SnopLogic ⚙️  
### A Modular Data Execution Engine (Not a Dashboard. Not Just SaaS.)

SnopLogic is **not** a dashboard tool.  
It is **not** only a chart builder.  
It is **not** just no-code.  
And it is **not** a typical SaaS.

**SnopLogic is a data execution engine.**

Dashboards, charts, no-code builders, APIs, widgets and even human tasks  
are **pluggable modules** —  
all powered by a **single core engine** that understands:

- how data is used  
- how often it is used  
- where it is rendered  
- who is allowed to use it  
- and how usage is monetized  

---

## 🧠 Core Idea

> **Visualization is not a UI concern.  
> It is a first-class data attribute handled by the engine.**

Most platforms treat charts, APIs and widgets as separate products.

SnopLogic treats them as **different execution surfaces**  
of the **same data logic**.

---

## 🏗️ Architecture Overview
┌──────────────┐ │ Dashboards   │ ├──────────────┤ │ Charts       │ ├──────────────┤ │ No-Code UI   │ ├──────────────┤ │ Widgets      │ ├──────────────┤ │ API Access   │ ├──────────────┤ │ Human Tasks  │ └───────┬──────┘ │ ┌───────▼─────────────────────┐ │        SNOP-ENGINE           │ │  (Execution + Metering Core)│ └───────┬─────────────────────┘ │ PostgreSQL / External Data
Modules can change.  
The engine does **not**.

---

## ⚙️ Snop-Engine (The Invention)

The engine is responsible for:

- 🔢 **Metering**  
  Track usage per action (API call, embed view, widget render, human task…)

- 🎟️ **Entitlements & Quotas**  
  Grant limits via packages instead of subscriptions

- 🔐 **Token & Scope Control**  
  Same data, different permissions (embed, api, public, private)

- 💸 **Usage-Based Monetization**  
  Pay per usage instead of monthly SaaS plans

- 🧠 **Execution Rules**  
  Decide *how* data behaves depending on context

---

## 🧩 Modular, Not Monolithic

Everything except the engine is a module.

### Core (Always On)
- Snop-Engine
- Metering & usage logs
- Token verification
- Package & quota logic

### Visual Modules
- Dashboards
- Charts
- 3D visualizations (React Three Fiber)
- Widgets

### Interaction Modules
- API data access
- Embed views
- Public links
- Human tasks (real people executing micro-tasks)

### Monetization Modules
- Pi-based packages
- Feature unlocks (watermark on/off)
- Usage bundles (1K, 10K, etc.)

---

## 💰 Monetization Philosophy

No subscriptions.  
No monthly lock-ins.

Users:
- deposit Pi
- buy **usage packages**
- consume only what they use

Examples:
- Embed views
- API calls
- Widget renders
- Watermark-free views
- Human task minutes

If you don’t use it, you don’t pay.

---

## 🌍 Why This Matters

SnopLogic is designed for:

- Developers who want **infrastructure**, not UI babysitting
- Pi Network ecosystem projects
- B2B data exchange platforms
- Experimental data products
- Anyone tired of SaaS limits

This is **a platform to build platforms**.

---

## 🧪 Current Status

- Core engine: ✅ implemented
- Usage metering: ✅
- Token & scope system: ✅
- Package & quota logic: ✅
- API & embed execution: ✅
- Human task module: 🟡 experimental
- 3D visualization layer: 🟡 planned

---

## 🤝 Who We’re Looking For

We are actively looking for contributors who want to **build something new**, not clone existing tools.

Especially:
- Backend engineers (PostgreSQL, Supabase, PL/pgSQL)
- Frontend engineers (Next.js, React, Three.js)
- Systems thinkers (billing, metering, infra)
- Pi Network developers
- Curious hackers

You don’t need permission.  
You need curiosity.

---

## 🚀 Vision

SnopLogic aims to become:

> **The execution layer for data-driven products.**

Not another dashboard.  
Not another SaaS.

An engine.

---

## 📜 License

Open-source (license to be finalized).

---

## 🧠 Final Note

If you’re here looking for:
- a chart tool → this is bigger
- a SaaS → this is deeper
- a dashboard → this is not the point

If you’re here to **invent**, welcome.
