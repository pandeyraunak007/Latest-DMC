# UI/UX Handoff Document
## DMPro - Data Modeling Studio

> Comprehensive UI/UX analysis for designers joining the project without prior context.
>
> **Document Version:** 1.0
> **Analysis Date:** January 2026
> **Live Application:** https://latest-dmc.vercel.app/

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Tech Stack (High-Level)](#2-tech-stack-high-level)
3. [Information Architecture](#3-information-architecture)
4. [User Personas (Inferred)](#4-user-personas-inferred)
5. [Core User Flows](#5-core-user-flows)
6. [Screen-by-Screen Breakdown](#6-screen-by-screen-breakdown)
7. [Component System Overview](#7-component-system-overview)
8. [UX & Visual Design Guidelines](#8-ux--visual-design-guidelines)
9. [Accessibility & Usability Review](#9-accessibility--usability-review)
10. [UX Gaps & Improvement Suggestions](#10-ux-gaps--improvement-suggestions)

---

## 1. Product Overview

### What This App Is

**DMPro (Data Modeling Studio)** is a professional-grade web application for creating, managing, and analyzing data models. It provides a visual diagramming environment where users can design database schemas, reverse engineer existing databases, generate SQL scripts, and compare model versions.

### What Problem It Solves

| Problem | How DMPro Solves It |
|---------|---------------------|
| Manual database schema design is error-prone | Visual drag-and-drop diagram editor with validation |
| Documenting existing databases is tedious | Reverse engineering imports existing DB schemas automatically |
| Generating consistent DDL scripts requires expertise | Forward engineering produces SQL from visual models |
| Tracking model changes across versions is difficult | Complete Compare feature shows side-by-side differences |
| Collaboration on data models lacks visibility | Activity feeds, version history, and team features |
| Understanding complex schemas requires deep analysis | AI assistant provides natural language Q&A about models |

### Who It Is For

**Primary Users:**
- Data Architects
- Database Administrators (DBAs)
- Data Engineers
- Solution Architects

**Secondary Users:**
- Software Developers (who interact with databases)
- Business Analysts (reviewing data structures)
- Technical Project Managers

**Enterprise Context:**
- Teams working with Microsoft Fabric/Azure data platforms
- Organizations with multiple database environments
- Companies requiring data governance and documentation

---

## 2. Tech Stack (High-Level)

### Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.5 | React framework with App Router |
| **React** | 18.3.1 | UI component library |
| **TypeScript** | 5.x | Type-safe development |

### Styling Approach

| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | 3.4.4 | Utility-first CSS framework |
| **Custom CSS Classes** | Reusable component styles in `globals.css` |
| **Framer Motion** | Page transitions and micro-interactions |

### Key Architectural Decisions That Affect UX

| Decision | UX Impact |
|----------|-----------|
| **Client-side routing via state** | Instant page transitions, no full page reloads |
| **Dark-mode-first design** | Optimized for long working sessions; light mode available |
| **AI integration (Groq API)** | Natural language interaction with diagrams |
| **Mock data architecture** | Currently demo-focused; real integrations will affect loading states |
| **Collapsible sidebar** | Maximizes canvas space for diagram editing |
| **Single-page application** | All navigation happens within Dashboard shell |

### State Management

- **React useState/useContext** for component and global state
- **No Redux/Zustand** - simpler state model
- **ThemeContext** for dark/light mode preference
- **localStorage** for theme persistence

---

## 3. Information Architecture

### Sitemap

```
DMPro Application
│
├── Homepage (Default Landing)
│   ├── My Work Section
│   │   ├── Recent Models
│   │   ├── Drafts & Reviews
│   │   └── Pinned Models
│   ├── Activity & Collaboration Feed
│   ├── Quick Actions Bar
│   └── AI Insights Panel
│
├── Dashboard
│   ├── Stats Overview (4 metrics)
│   ├── Quick Action Cards (4 actions)
│   ├── Models Panel
│   └── System Insights
│
├── Mart Catalog
│   ├── Model Library Browser
│   ├── Version History
│   └── Folder Structure
│
├── Model Explorer
│   ├── Create New Model
│   ├── Browse Templates
│   └── Model Metadata
│
├── Reverse Engineering (Wizard)
│   ├── Step 1: Source Selection
│   ├── Step 2: Extraction Options
│   ├── Step 3: Object Selection
│   └── Step 4: Execution & Results
│
├── Forward Engineering
│   ├── Model Selection
│   ├── Output Options
│   └── Script Generation
│
├── Complete Compare (Wizard)
│   ├── Step 1: Model Selection (Left/Right)
│   ├── Step 2: Comparison Configuration
│   └── Results & Merge View
│
├── Diagrammer (Main Editor)
│   ├── Canvas (Diagram View)
│   ├── Toolbar (Tools)
│   ├── Quick Editor Panel
│   └── Properties Panel
│
├── Settings
│   ├── General
│   ├── Database Connections
│   ├── Display & Theme
│   ├── Naming Conventions
│   └── Advanced Options
│
└── [Floating] AI Chat Assistant
    ├── Chat History
    ├── Context-Aware Suggestions
    └── Action Execution
```

### Page Purpose & Responsibilities

| Page | Primary Purpose | Key Actions |
|------|-----------------|-------------|
| **Homepage** | Daily starting point; shows recent work and activity | Resume editing, review activity, quick actions |
| **Dashboard** | System overview and metrics | View stats, access models, launch tools |
| **Mart Catalog** | Browse and manage model library | Search, filter, version control |
| **Model Explorer** | Create and organize models | New model, templates, metadata |
| **Reverse Engineering** | Import existing database schemas | Connect DB, select objects, generate model |
| **Forward Engineering** | Generate DDL from models | Select model, configure output, download scripts |
| **Complete Compare** | Compare two model versions | Select models, view differences, merge |
| **Diagrammer** | Visual model editing | Create tables, relationships, edit properties |
| **Settings** | Configure application preferences | Theme, connections, conventions |

---

## 4. User Personas (Inferred)

### Persona 1: "The Data Architect" (Primary)

| Attribute | Details |
|-----------|---------|
| **Role** | Senior Data Architect at enterprise company |
| **Experience** | 10+ years in data modeling, familiar with ERwin/ER/Studio |
| **Goals** | Design logical and physical data models; ensure data integrity; document standards |
| **Pain Points** | Legacy tools are slow; collaboration is difficult; version control is manual |
| **How DMPro Helps** | Modern web interface; AI assistance; integrated comparison; activity tracking |
| **Typical Tasks** | Create new models, reverse engineer production DBs, generate DDL for deployments |

### Persona 2: "The DBA" (Primary)

| Attribute | Details |
|-----------|---------|
| **Role** | Database Administrator managing multiple environments |
| **Experience** | 5-8 years managing SQL Server, Azure, Fabric |
| **Goals** | Maintain database health; execute schema changes safely; document structures |
| **Pain Points** | No visual overview of complex schemas; manual script writing; tracking changes |
| **How DMPro Helps** | Reverse engineering provides instant documentation; forward engineering generates scripts |
| **Typical Tasks** | Import existing schemas, compare dev vs prod, generate migration scripts |

### Persona 3: "The Developer" (Secondary)

| Attribute | Details |
|-----------|---------|
| **Role** | Backend Developer building data-driven applications |
| **Experience** | 3-5 years, familiar with ORMs and basic SQL |
| **Goals** | Understand database structure; make schema changes; avoid breaking changes |
| **Pain Points** | Database documentation is outdated; unsure about relationships; fear of migrations |
| **How DMPro Helps** | Visual diagram shows relationships; AI explains structure; compare catches issues |
| **Typical Tasks** | View model diagrams, ask AI questions, review changes before deployment |

### Persona 4: "The Business Analyst" (Secondary)

| Attribute | Details |
|-----------|---------|
| **Role** | Business Analyst defining data requirements |
| **Experience** | Non-technical but data-literate |
| **Goals** | Understand what data exists; communicate requirements; validate implementations |
| **Pain Points** | Technical diagrams are confusing; can't access database tools; relies on others |
| **How DMPro Helps** | Clean visual diagrams; natural language AI chat; read-only access |
| **Typical Tasks** | Browse models, ask AI about entities, review activity feed |

---

## 5. Core User Flows

### Flow 1: First-Time User Experience

| Step | Screen | User Action | System Response |
|------|--------|-------------|-----------------|
| 1 | App Load | User navigates to app | Shows Homepage with greeting |
| 2 | Homepage | Views "My Work" section | Displays recent models (empty if new) |
| 3 | Homepage | Clicks "New Model" quick action | Navigates to Model Explorer |
| 4 | Model Explorer | Selects template or blank model | Creates model, opens Diagrammer |
| 5 | Diagrammer | Views empty canvas with sample data | Shows mock tables for demo |

**Success State:** User has a working model open in the editor

**Empty State:** "No recent models" message with prompt to create first model

---

### Flow 2: Reverse Engineering (Import Database)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        REVERSE ENGINEERING FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

TRIGGER: User clicks "Import from DB" on Homepage or "Reverse Engineering" in sidebar

STEP 1: SOURCE SELECTION
┌─────────────────────────────────────────────────────────────────────────────┐
│  User Actions:                                                              │
│  • Select source type: Database OR Script File                              │
│  • Select model type: Conceptual / Logical / Physical / Logical-Physical   │
│  • For Database:                                                            │
│    - Platform: MS Fabric (currently only supported)                         │
│    - Environment: Lakehouse OR Warehouse                                    │
│    - Enter connection credentials                                           │
│    - Click "Test Connection"                                                │
│  • For Script: Upload .sql file                                             │
│                                                                             │
│  Validation: Cannot proceed until connection successful OR file uploaded    │
│  States: idle → testing → success/error                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
STEP 2: EXTRACTION OPTIONS
┌─────────────────────────────────────────────────────────────────────────────┐
│  User Actions:                                                              │
│  • Select preset: Complete / Standard / Basic                               │
│  • OR customize 30+ extraction options:                                     │
│    - Database Objects (tables, views, procedures, triggers)                 │
│    - Table Components (columns, defaults, computed columns)                 │
│    - Constraints (PK, FK, unique, check)                                    │
│    - Indexes (clustered, non-clustered)                                     │
│    - Relationships, Documentation, Security                                 │
│  • Confirm extraction settings                                              │
│                                                                             │
│  Validation: Must confirm extraction options to proceed                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
STEP 3: OBJECT SELECTION
┌─────────────────────────────────────────────────────────────────────────────┐
│  User Actions:                                                              │
│  • Browse schema tree (expandable/collapsible)                              │
│  • Search objects by name                                                   │
│  • Filter by type: All / Tables / Views                                     │
│  • Select/deselect individual objects or entire schemas                     │
│  • View selection count in header                                           │
│                                                                             │
│  Validation: At least 1 object must be selected                             │
│  Empty State: "No objects match filter" with clear filter option            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
STEP 4: EXECUTION & RESULTS
┌─────────────────────────────────────────────────────────────────────────────┐
│  User Actions:                                                              │
│  • Click "Start Reverse Engineering"                                        │
│  • Watch progress bar with status messages                                  │
│  • View completion summary                                                  │
│  • Click "Open in Diagrammer" to view model                                 │
│                                                                             │
│  Progress Messages:                                                         │
│  10% - "Connecting to database..."                                          │
│  25% - "Reading schema information..."                                      │
│  45% - "Analyzing table structures..."                                      │
│  60% - "Detecting relationships..."                                         │
│  80% - "Generating entity models..."                                        │
│  95% - "Finalizing model..."                                                │
│  100% - "Complete!"                                                         │
│                                                                             │
│  Success State: Toast notification + entity count + "Open in Diagrammer"    │
│  Failure State: Error toast with retry option                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Flow 3: Model Comparison

```
TRIGGER: User clicks "Compare" on Homepage or "Complete Compare" in sidebar

STEP 1: MODEL SELECTION
┌─────────────────────────────────────────────────────────────────────────────┐
│  Left Panel (Baseline):           │  Right Panel (Target):                  │
│  • Source: Mart / File / Database │  • Source: Mart / File / Database       │
│  • Select model from list         │  • Select model from list               │
│  • Test connection if DB          │  • Test connection if DB                │
│                                                                             │
│  Validation: Both models must be selected                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
STEP 2: COMPARISON & RESULTS
┌─────────────────────────────────────────────────────────────────────────────┐
│  Configuration:                                                             │
│  • Select profile: Complete / Structure / Basic                             │
│  • Toggle 28 comparison options (case sensitivity, whitespace, etc.)        │
│  • Click "Run Comparison"                                                   │
│                                                                             │
│  Results Display:                                                           │
│  • Hierarchical tree view (expandable nodes)                                │
│  • Filter: All / Conflicts / Different / Equal / Left-only / Right-only    │
│  • Status badges: EQUAL (green) / DIFFERENT (amber) / CONFLICT (red)        │
│  • Click node to see side-by-side values                                    │
│                                                                             │
│  Actions Available:                                                         │
│  • View Full Report                                                         │
│  • Create Delta Model (merge)                                               │
│  • Generate Sync Script                                                     │
│  • Export (PDF / Excel / HTML)                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Flow 4: Diagram Editing with AI

```
TRIGGER: User opens a model in Diagrammer

MAIN CANVAS INTERACTION:
┌─────────────────────────────────────────────────────────────────────────────┐
│  Manual Editing:                                                            │
│  • Click canvas to add table (when table tool selected)                     │
│  • Drag tables to reposition                                                │
│  • Click table to select and edit in Quick Editor                           │
│  • Draw relationship lines between tables                                   │
│  • Right-click for context menu                                             │
│                                                                             │
│  Quick Editor Panel (Right Side):                                           │
│  • Columns tab: Add/edit/delete columns                                     │
│  • Indexes tab: Define indexes                                              │
│  • Foreign Keys tab: Manage relationships                                   │
│  • Constraints tab: Add check constraints                                   │
│  • Triggers tab: Define triggers                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
AI CHAT INTERACTION:
┌─────────────────────────────────────────────────────────────────────────────┐
│  User opens floating AI Chat (bottom right)                                 │
│                                                                             │
│  Example Interactions:                                                      │
│  User: "Add a new table called Inventory with columns product_id,           │
│         quantity, and warehouse_id"                                         │
│  AI: Creates table with specified columns                                   │
│  System: Executes action, updates diagram                                   │
│                                                                             │
│  User: "What tables reference the Users table?"                             │
│  AI: Analyzes relationships, provides answer                                │
│                                                                             │
│  User: "Add a foreign key from Orders.customer_id to Customers.id"          │
│  AI: Creates relationship with proper cardinality                           │
│                                                                             │
│  Context Awareness:                                                         │
│  • AI receives current diagram state (tables, columns, relationships)       │
│  • Knows which table is currently selected                                  │
│  • Can reference existing objects in suggestions                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Flow 5: Forward Engineering (Generate DDL)

```
TRIGGER: User clicks "Generate DDL" on Homepage or Forward Engineering in sidebar

STEP 1: MODEL & OUTPUT SELECTION
┌─────────────────────────────────────────────────────────────────────────────┐
│  • Select source model from Mart catalog                                    │
│  • Choose output format: SQL Script / Fabric Lakehouse / Fabric Warehouse   │
│  • Select objects to include (tables, views, procedures)                    │
│  • Configure generation options (drop statements, comments, etc.)           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
STEP 2: VALIDATION & PREVIEW
┌─────────────────────────────────────────────────────────────────────────────┐
│  • System validates model against target platform                           │
│  • Shows validation progress and messages                                   │
│  • Displays warnings for potential issues                                   │
│  • Preview generated script                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
STEP 3: GENERATION & DOWNLOAD
┌─────────────────────────────────────────────────────────────────────────────┐
│  • Generate final script                                                    │
│  • Download as .sql file                                                    │
│  • OR execute directly to Fabric (if connected)                             │
│  • Success toast with file details                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Screen-by-Screen Breakdown

### 6.1 Homepage

**Purpose:** Daily starting point showing recent work, activity, and quick actions

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER: Greeting + Search + AI Chat Launcher                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ QUICK ACTIONS BAR (Full Width) ────────────────────────────────────┐   │
│  │  [New Model] [Import DB] [Import DDL] [Generate DDL] [Compare]      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ MY WORK (Left 2/3) ────────────────┐ ┌─ ACTIVITY FEED (Right 1/3) ─┐   │
│  │  [Recent] [Drafts] [Pinned]         │ │  Filter: All|Mentions|Reviews│   │
│  │                                      │ │                              │   │
│  │  Model Card                         │ │  Activity Item               │   │
│  │  - Name, Status Badge               │ │  - Icon, User, Action        │   │
│  │  - Path, Entities, Modified         │ │  - Time, Resolve Button      │   │
│  │  - Pin Icon                         │ │                              │   │
│  │  ...more models...                  │ │  ...more activities...       │   │
│  └─────────────────────────────────────┘ └──────────────────────────────┘   │
│                                                                             │
│  ┌─ AI INSIGHTS PANEL (Full Width) ────────────────────────────────────┐   │
│  │  Natural Language Search Input                                       │   │
│  │  Suggestion Cards: [Accept] [Dismiss] [Defer]                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key UI Elements:**

| Element | Type | Behavior |
|---------|------|----------|
| Greeting Banner | Text | Dynamic: "Good morning/afternoon/evening, Data Architect" |
| Quick Action Buttons | Button Group | 5 colored buttons, navigate to respective features |
| Tab Navigation | Tabs | Recent / Drafts & Reviews / Pinned (max 10) |
| Model Cards | Card List | Clickable, shows status badge, pin toggle |
| Activity Items | Feed List | Filterable, action buttons (Resolve, Review) |
| AI Search Input | Text Input | Placeholder: "Ask AI about your models..." |

**States:**

| State | Condition | Display |
|-------|-----------|---------|
| Empty - Recent | No models accessed | "No recent models" + Create CTA |
| Empty - Pinned | No pinned models | Star icon + "No pinned models yet" |
| Empty - Activity | No activities | Activity icon + "No activities to show" |
| Loading | Fetching models | Skeleton cards (not currently implemented) |

**Designer Notes:**
- Consider adding skeleton loading states for async data
- Activity feed scrolls independently; may need infinite scroll for long lists
- Pin icon should have clear toggle state (filled vs outline)
- Status badges need consistent color coding across app

---

### 6.2 Diagrammer (Main Editor)

**Purpose:** Visual data model editor - the core workspace

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOOLBAR: [Select] [Table] [Relationship] [Note] [Move] | Zoom | Settings  │
├────────────────────────────────────────────────────────┬────────────────────┤
│                                                        │                    │
│                                                        │  QUICK EDITOR      │
│                                                        │  PANEL (Collapsible)│
│                      CANVAS                            │                    │
│                                                        │  [Columns]         │
│   ┌─────────┐        ┌─────────┐                      │  [Indexes]         │
│   │ Users   │───────▶│ Orders  │                      │  [Foreign Keys]    │
│   │─────────│        │─────────│                      │  [Constraints]     │
│   │ id PK   │        │ id PK   │                      │  [Triggers]        │
│   │ name    │        │ user_id │                      │                    │
│   │ email   │        │ total   │                      │  Column Editor:    │
│   └─────────┘        └─────────┘                      │  Name: [        ]  │
│                                                        │  Type: [Dropdown]  │
│                                                        │  ☑ Primary Key     │
│                                                        │  ☑ Not Null        │
│                                                        │                    │
├────────────────────────────────────────────────────────┴────────────────────┤
│  STATUS BAR: Tables: 4 | Relationships: 3 | Last saved: 2 min ago          │
└─────────────────────────────────────────────────────────────────────────────┘
                                                               ┌──────────────┐
                                                               │ AI Chat 💬   │
                                                               │ (Floating)   │
                                                               └──────────────┘
```

**Key UI Elements:**

| Element | Type | Behavior |
|---------|------|----------|
| Toolbar | Button Group | Tool selection (Select, Table, Relationship, Note, Move) |
| Canvas | Interactive Area | Drag tables, draw relationships, zoom/pan |
| Table Nodes | Diagram Element | Draggable, selectable, shows columns |
| Relationship Lines | Diagram Element | Connects tables, shows cardinality |
| Quick Editor | Side Panel | Tabbed interface for selected table properties |
| AI Chat Button | Floating Button | Opens chat overlay in bottom-right |

**Primary Actions:**
1. Add new table (click canvas with table tool)
2. Edit table properties (select table, use Quick Editor)
3. Create relationship (draw line between tables)
4. Ask AI for help (open chat, type question)

**Secondary Actions:**
- Zoom in/out
- Pan canvas
- Delete selected element
- Duplicate table
- Auto-layout

**States:**

| State | Condition | Display |
|-------|-----------|---------|
| Empty Canvas | New model | "Click to add your first table" (not implemented) |
| Table Selected | User clicked table | Highlight border, Quick Editor shows props |
| Drawing Relationship | Relationship tool active | Cursor changes, shows line preview |
| AI Processing | Chat request in progress | Spinner in chat, disabled send button |

**Designer Notes:**
- Canvas should support touch gestures for tablet users
- Consider mini-map for large diagrams
- Quick Editor panel should remember collapsed state
- Need visual feedback when AI executes diagram changes
- Table nodes need better visual hierarchy for column types

---

### 6.3 Reverse Engineering Wizard

**Purpose:** Import existing database schema into a visual model

**Layout:** Multi-step wizard with progress indicator

**Step 1: Source Selection**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP INDICATOR: ● Source ○ Options ○ Objects ○ Execute                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SOURCE TYPE                           MODEL TYPE                           │
│  ┌────────────┐ ┌────────────┐        ┌─────────────────────────────────┐  │
│  │ Database   │ │ Script     │        │ ○ Conceptual                    │  │
│  │ (selected) │ │            │        │ ○ Logical                       │  │
│  └────────────┘ └────────────┘        │ ● Physical (selected)           │  │
│                                        │ ○ Logical-Physical              │  │
│  DATABASE PLATFORM                     └─────────────────────────────────┘  │
│  ┌─────────────────────────────┐                                           │
│  │ 🔷 Microsoft Fabric         │                                           │
│  └─────────────────────────────┘                                           │
│                                                                             │
│  ENVIRONMENT                           CONNECTION                           │
│  ○ Lakehouse  ● Warehouse              Server: [________________]          │
│                                        Database: [________________]        │
│  WAREHOUSE SELECTION                   Username: [________________]        │
│  [Dropdown: Select warehouse ▼]        Password: [________________]        │
│                                        ☑ Use SSO                           │
│                                                                             │
│                                        [Test Connection]  ✓ Connected       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                    [Cancel]  [Next: Extraction Options →]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key UI Elements:**

| Element | Behavior |
|---------|----------|
| Step Indicator | Shows current step, allows back-navigation to completed steps |
| Source Type Toggle | Database or Script File selection |
| Model Type Radio | Conceptual / Logical / Physical / Logical-Physical |
| Platform Cards | Currently only MS Fabric supported |
| Environment Toggle | Lakehouse or Warehouse |
| Connection Form | Server, Database, Username, Password, SSO toggle |
| Test Connection Button | Tests credentials, shows success/error state |

**Validation:**
- Next button disabled until: Model type selected AND Connection successful

**States:**

| State | Visual Indicator |
|-------|------------------|
| Connection Idle | Gray "Test Connection" button |
| Connection Testing | Spinner icon, "Testing..." text |
| Connection Success | Green checkmark, "Connected" badge |
| Connection Error | Red X icon, error message |

---

### 6.4 Complete Compare

**Purpose:** Compare two data models side-by-side

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP INDICATOR: ● Selection ○ Comparison                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ LEFT MODEL (Baseline) ─────────┐  ┌─ RIGHT MODEL (Target) ─────────┐   │
│  │                                  │  │                                 │   │
│  │  Source: [Mart ▼] [File] [DB]   │  │  Source: [Mart ▼] [File] [DB]  │   │
│  │                                  │  │                                 │   │
│  │  Selected: Customer_Order_v2.0  │  │  Selected: Customer_Order_v3.0 │   │
│  │  Entities: 15                   │  │  Entities: 18                  │   │
│  │  Relationships: 12              │  │  Relationships: 15             │   │
│  │                                  │  │                                 │   │
│  │  [Browse Models]                │  │  [Browse Models]               │   │
│  └──────────────────────────────────┘  └─────────────────────────────────┘   │
│                                                                             │
│                        [Run Comparison]                                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  COMPARISON RESULTS                                                         │
│  ┌─ Filters ─────────────────────────────────────────────────────────────┐ │
│  │ [All] [Conflicts: 3] [Different: 12] [Equal: 45] [Left Only] [Right]  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ▼ Entities                                                                │
│    ├─ ● Customer (Equal)                                                   │
│    ├─ ◐ Order (Different) - 2 column changes                              │
│    ├─ + Inventory (Right Only)                                            │
│    ├─ - Legacy_Table (Left Only)                                          │
│    └─ ⚠ Payment (Conflict) - Type mismatch                                │
│                                                                             │
│  ▶ Relationships (collapsed)                                               │
│  ▶ Views (collapsed)                                                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Export PDF] [Export Excel] [Create Delta Model] [Generate Sync Script]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key UI Elements:**

| Element | Behavior |
|---------|----------|
| Model Selection Cards | Left/Right model selection with source tabs |
| Source Tabs | Mart / File / Database options |
| Filter Pills | Filter results by status type |
| Results Tree | Expandable/collapsible hierarchy |
| Status Icons | ● Equal, ◐ Different, + New, - Missing, ⚠ Conflict |
| Action Buttons | Export and generation options |

**States:**

| State | Display |
|-------|---------|
| No Models Selected | Empty cards with "Select a model" prompt |
| Comparison Running | Spinner, "Comparing..." message |
| Results Ready | Tree view with filters |
| No Differences | Success message "Models are identical" |

---

### 6.5 Settings

**Purpose:** Configure application preferences

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SETTINGS                                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─ CATEGORIES ─────────┐  ┌─ SETTINGS PANEL ───────────────────────────┐  │
│  │                       │  │                                            │  │
│  │  ▶ General           │  │  DISPLAY & THEME                           │  │
│  │  ▶ Database          │  │                                            │  │
│  │  ● Display & Theme   │  │  Theme                                     │  │
│  │  ▶ Naming            │  │  ○ Light  ● Dark  ○ System                 │  │
│  │  ▶ Export/Import     │  │                                            │  │
│  │  ▶ Advanced          │  │  Show Grid                                 │  │
│  │  ▶ Performance       │  │  [Toggle: ON]                              │  │
│  │  ▶ Integrations      │  │                                            │  │
│  │                       │  │  Grid Size                                 │  │
│  │                       │  │  [Slider: 20px]                            │  │
│  │                       │  │                                            │  │
│  │                       │  │  Auto-zoom to fit                          │  │
│  │                       │  │  [Toggle: OFF]                             │  │
│  │                       │  │                                            │  │
│  └───────────────────────┘  └────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                           [Reset to Defaults]  [Save]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Setting Categories:**

| Category | Settings Included |
|----------|-------------------|
| General | Auto-save interval, language, timezone |
| Database | Default connections, timeout, retry settings |
| Display & Theme | Dark/Light mode, grid, zoom defaults |
| Naming | Case conventions, prefixes, suffixes |
| Export/Import | Default formats, encoding, line endings |
| Advanced | Debug mode, logging level, cache settings |
| Performance | Canvas rendering, animation toggle |
| Integrations | API keys, webhook URLs |

---

### 6.6 AI Chat (Floating)

**Purpose:** Natural language interaction with the diagram

**Layout:**
```
┌─────────────────────────────────┐
│  AI Assistant          [−] [×] │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🤖 How can I help you      ││
│  │    with your data model?   ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 👤 Add a table called      ││
│  │    Products with id, name  ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🤖 I'll create a Products  ││
│  │    table with the columns  ││
│  │    you specified.          ││
│  │                             ││
│  │ [Execute Actions]           ││
│  └─────────────────────────────┘│
│                                 │
├─────────────────────────────────┤
│ [Type a message...    ] [Send] │
└─────────────────────────────────┘
```

**Key UI Elements:**

| Element | Behavior |
|---------|----------|
| Header | Title + Minimize/Close buttons |
| Message List | Scrollable chat history |
| User Messages | Right-aligned, different background |
| AI Messages | Left-aligned, includes action buttons |
| Execute Actions | Applies AI suggestions to diagram |
| Input Field | Enter to send, Shift+Enter for newline |

**States:**

| State | Display |
|-------|---------|
| Minimized | Small floating button in corner |
| Expanded | Full chat panel |
| Loading | Spinner in message area, disabled input |
| Error | Error message with retry option |
| Success | Action executed confirmation |

---

## 7. Component System Overview

### Reusable Components

| Component | Location | Purpose | Key Props |
|-----------|----------|---------|-----------|
| **WizardLayout** | `/shared/` | Multi-step wizard container | `steps`, `currentStep`, `onNext`, `onBack` |
| **StepIndicator** | `/shared/` | Visual step progress | `steps[]`, `currentStep`, clickable steps |
| **ProgressBar** | `/shared/` | Animated progress display | `progress`, `message`, `animated` |
| **Toast** | `/shared/` | Notification messages | `type`, `title`, `message`, `duration` |
| **ConnectionCard** | `/shared/` | Database connection selector | `selected`, `disabled`, `badge`, `onClick` |
| **ThemeToggle** | `/shared/` | Dark/Light mode switch | Uses ThemeContext |

### Props-Driven Behavior

**Toast Component Example:**
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  visible: boolean;
  onClose: () => void;
  duration?: number; // auto-dismiss after ms
}
```

**Color Mapping:**
- `success` → Emerald background + icon
- `error` → Red background + icon
- `warning` → Amber background + icon
- `info` → Blue background + icon

### Design Consistency Expectations

| Pattern | Standard |
|---------|----------|
| Button Primary | `bg-violet-600 hover:bg-violet-700 text-white rounded-md` |
| Button Secondary | `border border-zinc-700 text-zinc-300 hover:bg-zinc-800` |
| Card/Panel | `bg-zinc-900 border border-zinc-800 rounded-lg p-4` |
| Input Field | `bg-zinc-950 border border-zinc-800 rounded-md focus:border-zinc-600` |
| Badge | `bg-zinc-700 text-zinc-100 rounded-full px-2 py-0.5 text-xs` |

---

## 8. UX & Visual Design Guidelines

### Spacing & Layout Patterns

**Spacing Scale (Tailwind):**
```
Space-1:  4px  (gap-1, p-1)   - Tight inline spacing
Space-2:  8px  (gap-2, p-2)   - Default element spacing
Space-3:  12px (gap-3, p-3)   - Comfortable spacing
Space-4:  16px (gap-4, p-4)   - Section internal padding
Space-6:  24px (gap-6, p-6)   - Section separation
Space-8:  32px (gap-8, p-8)   - Major section breaks
```

**Grid Patterns:**
```
Single Column Mobile:     grid-cols-1
Two Column Small:         sm:grid-cols-2
Three Column Medium:      md:grid-cols-3
Four Column Large:        lg:grid-cols-4
Sidebar + Content:        grid-cols-[256px_1fr]
```

### Typography Hierarchy

| Level | Style | Usage |
|-------|-------|-------|
| Page Title | `text-3xl font-bold` | Main headings (e.g., "Welcome back") |
| Section Header | `text-lg font-semibold` | Panel titles |
| Subsection | `text-sm font-medium` | Card headers, tab labels |
| Body Text | `text-sm` | Content, descriptions |
| Caption | `text-xs text-zinc-400` | Metadata, timestamps |
| Label | `text-xs font-medium uppercase tracking-wider` | Form labels |

### Color Usage

**Semantic Colors:**

| Purpose | Color | Tailwind Class |
|---------|-------|----------------|
| Primary Action | Violet | `bg-violet-600` |
| Success | Emerald | `bg-emerald-500` |
| Warning | Amber | `bg-amber-500` |
| Error | Red | `bg-red-500` |
| Info | Blue | `bg-blue-500` |
| Neutral | Zinc | `bg-zinc-700` |

**Background Hierarchy (Dark Mode):**
```
App Background:    bg-zinc-950  (#09090b)
Panel Background:  bg-zinc-900  (#18181b)
Input Background:  bg-zinc-950  (#09090b)
Hover State:       bg-zinc-800  (#27272a)
Active State:      bg-zinc-700  (#3f3f46)
```

**Text Colors:**
```
Primary Text:    text-zinc-100  (#f4f4f5)
Secondary Text:  text-zinc-400  (#a1a1aa)
Muted Text:      text-zinc-500  (#71717a)
Disabled Text:   text-zinc-600  (#52525b)
```

### Interaction Patterns

| Interaction | Feedback |
|-------------|----------|
| Button Hover | Background darkens/lightens |
| Button Click | Slight scale or shadow change |
| Link Hover | Underline or color change |
| Tab Active | Bottom border indicator |
| Checkbox Toggle | Immediate visual state change |
| Drag Start | Cursor change, element opacity |
| Loading | Spinner animation (Loader2 icon) |
| Success | Toast notification + checkmark |
| Error | Toast notification + shake animation |

### Animation Guidelines

**Transitions (via Framer Motion):**
```
Page Transition:   duration: 300ms, fade + slide up 20px
Panel Expand:      duration: 200ms, ease-out
Modal Open:        duration: 200ms, scale from 0.95 + fade
Toast Appear:      duration: 200ms, slide in from right
Hover States:      duration: 150ms, ease-in-out
```

---

## 9. Accessibility & Usability Review

### Current State Summary

| Category | Status | Notes |
|----------|--------|-------|
| Keyboard Navigation | ⚠️ Limited | Only Enter key for chat input |
| ARIA Attributes | ❌ Missing | No ARIA labels found |
| Focus Management | ⚠️ Basic | Input focus on chat open only |
| Color Contrast | ⚠️ Concerns | Muted text may not meet WCAG AA |
| Form Labels | ❌ Missing | Inputs use placeholders only |
| Screen Reader | ❌ Poor | Icon-only buttons lack labels |
| Mobile Responsive | ✅ Good | Tailwind breakpoints used throughout |

### Keyboard Navigation

**Current:**
- Tab key moves between focusable elements (default browser behavior)
- Enter key submits chat messages
- No keyboard shortcuts for common actions

**Missing:**
- No skip links to main content
- No keyboard shortcuts documentation
- No focus trapping in modals
- No arrow key navigation in menus/lists

### ARIA Attributes

**Completely absent.** Recommended additions:

| Element | Required ARIA |
|---------|---------------|
| Icon Buttons | `aria-label="Close"`, `aria-label="Minimize"` |
| Collapsible Sections | `aria-expanded`, `aria-controls` |
| Tabs | `role="tablist"`, `role="tab"`, `aria-selected` |
| Modals | `role="dialog"`, `aria-modal`, `aria-labelledby` |
| Loading States | `aria-live="polite"`, `aria-busy` |
| Error Messages | `role="alert"`, `aria-describedby` |

### Color Contrast Issues

| Element | Current | Recommendation |
|---------|---------|----------------|
| Muted text (`text-zinc-500`) | ~4.5:1 ratio | May fail WCAG AA for small text |
| Secondary text (`text-zinc-400`) | ~5:1 ratio | Borderline - test thoroughly |
| Disabled elements | Low contrast | Add visible disabled patterns |

### Form Usability

**Current Issues:**
- Placeholder text disappears when typing (no persistent labels)
- No inline error messages near fields
- Required fields not marked
- No input format hints (e.g., expected date format)

**Recommendations:**
- Add floating labels or persistent labels above inputs
- Show inline validation errors below fields
- Mark required fields with asterisk
- Add help text for complex inputs

### Mobile Responsiveness

**Well Implemented:**
- Responsive grid layouts adapt to screen size
- Sidebar collapses on smaller screens
- Touch-friendly button sizes (mostly)
- Readable font sizes

**Needs Improvement:**
- Diagram canvas touch gestures
- Mobile-optimized Quick Editor
- Bottom navigation for mobile (currently sidebar)

---

## 10. UX Gaps & Improvement Suggestions

### Quick Wins (Low Effort, High Impact)

| Gap | Improvement | Effort |
|-----|-------------|--------|
| Icon buttons lack labels | Add `aria-label` to all icon-only buttons | 1-2 hours |
| No loading skeletons | Add skeleton screens for async content | 2-4 hours |
| Missing empty states | Design friendly empty states with CTAs | 2-4 hours |
| No keyboard shortcuts | Add `?` key to show shortcuts modal | 4-8 hours |
| Form validation unclear | Add inline error messages with icons | 4-8 hours |
| No confirmation dialogs | Add confirm before destructive actions | 2-4 hours |

### Medium Effort Improvements

| Gap | Improvement | Effort |
|-----|-------------|--------|
| No onboarding | Add first-time user tutorial or tooltips | 2-3 days |
| No undo/redo | Implement command history for diagram changes | 3-5 days |
| Limited search | Add global search across models, entities | 2-3 days |
| No breadcrumbs | Show navigation path in header | 1-2 days |
| Missing tooltips | Add tooltips for toolbar icons and buttons | 1-2 days |
| No autosave indicator | Show save status in header/footer | 1 day |
| Poor error recovery | Improve error messages with actions | 2-3 days |

### Strategic UX Enhancements

| Gap | Improvement | Effort | Impact |
|-----|-------------|--------|--------|
| No collaboration | Real-time multi-user editing | 4-6 weeks | High |
| Limited AI context | Show AI "understanding" of diagram | 2-3 weeks | Medium |
| No version history | Timeline view of model changes | 3-4 weeks | High |
| No templates library | Curated starting templates | 2-3 weeks | Medium |
| No export previews | Preview exports before download | 1-2 weeks | Medium |
| Limited mobile | Native-like mobile experience | 4-6 weeks | Medium |
| No offline mode | PWA with offline capabilities | 3-4 weeks | Low |
| No dark/light preview | Live theme preview in settings | 1 week | Low |

### Information Architecture Improvements

| Current | Suggested Change |
|---------|------------------|
| Homepage + Dashboard | Merge into single unified home |
| 10 sidebar items | Group into categories (Model, Engineering, Compare, Settings) |
| Flat navigation | Add breadcrumbs for context |
| Hidden AI Chat | Promote AI more prominently for new users |
| Separate Diagram/Diagrammer | Unify into single editing experience |

### Micro-Interaction Additions

| Action | Suggested Feedback |
|--------|-------------------|
| Save | Subtle "Saved" toast or checkmark in header |
| Delete | Confirm dialog with undo option |
| Copy | "Copied!" tooltip near cursor |
| Drag drop | Ghost preview of element |
| Successful action | Confetti or subtle celebration for milestones |
| AI response | Typing indicator while generating |

---

## Appendix: File Reference

| Purpose | File Path |
|---------|-----------|
| App Entry | `src/app/page.tsx` |
| Root Layout | `src/app/layout.tsx` |
| Main Dashboard | `src/components/Dashboard.tsx` |
| Homepage | `src/components/Homepage.tsx` |
| Diagrammer | `src/components/Diagrammer.tsx` |
| AI Chat | `src/components/AIChat.tsx` |
| Reverse Engineering | `src/components/ReverseEngineeringNew.tsx` |
| Complete Compare | `src/components/CompleteCompare2.tsx` |
| Settings | `src/components/Settings.tsx` |
| Global Styles | `src/app/globals.css` |
| Tailwind Config | `tailwind.config.ts` |
| Theme Context | `src/context/ThemeContext.tsx` |
| Shared Components | `src/components/shared/*` |

---

*Document prepared for UI/UX design handoff. All observations based on codebase analysis as of January 2026.*
