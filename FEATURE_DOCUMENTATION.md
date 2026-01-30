# Feature Documentation - Data Model Center (DMC)

> Comprehensive documentation of implemented features with user flows, UI elements, and benefits.

---

## Table of Contents

1. [Complete Compare](#complete-compare)
   - [Overview](#overview)
   - [User Flow](#user-flow)
   - [UI Elements](#ui-elements)
   - [Benefits](#benefits)
   - [Usage Examples](#usage-examples)

2. [Reverse Engineering](#reverse-engineering)
   - [Overview](#reverse-engineering-overview)
   - [User Flow](#reverse-engineering-user-flow)
   - [UI Elements](#reverse-engineering-ui-elements)
   - [Configuration Options](#reverse-engineering-configuration-options)
   - [Benefits](#reverse-engineering-benefits)
   - [Usage Examples](#reverse-engineering-usage-examples)

3. [Forward Engineering](#forward-engineering)
   - [Overview](#forward-engineering-overview)
   - [User Flow](#forward-engineering-user-flow)
   - [UI Elements](#forward-engineering-ui-elements)
   - [Configuration Options](#forward-engineering-configuration-options)
   - [Benefits](#forward-engineering-benefits)
   - [Usage Examples](#forward-engineering-usage-examples)

---

# Complete Compare

## Overview

**Complete Compare** is an enterprise-grade model comparison tool that enables users to compare two data models side-by-side, identify differences, and generate actionable outputs such as delta models, synchronization scripts, and comprehensive reports.

The feature supports three implementation variants:
| Variant | Purpose | Best For |
|---------|---------|----------|
| **CompleteCompare** | 5-step guided wizard | Standard users, step-by-step guidance |
| **CompleteCompare2** | 2-step advanced workflow | Power users, enterprise needs |
| **QuickCompare** | Lightweight 3-phase comparison | Quick checks, simple comparisons |

---

## User Flow

### Primary User Journey (CompleteCompare - 5-Step Wizard)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMPLETE COMPARE WORKFLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
     │  STEP 1  │────▶│  STEP 2  │────▶│  STEP 3  │────▶│  STEP 4  │────▶│  STEP 5  │
     │  Source  │     │  Options │     │  Objects │     │ Advanced │     │ Results  │
     │Selection │     │          │     │Selection │     │ Options  │     │& Actions │
     └──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
          │                │                │                │                │
          ▼                ▼                ▼                ▼                ▼
    Select Models    Configure       Choose Objects    Set Conflict     View & Export
    to Compare       Comparison      to Include        Resolution       Results
```

---

### Step 1: Source Selection

**Purpose:** Select the two models (Baseline and Target) to compare.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SOURCE SELECTION                                  │
├─────────────────────────────────┬───────────────────────────────────────────┤
│      BASELINE MODEL (Left)      │         TARGET MODEL (Right)              │
├─────────────────────────────────┼───────────────────────────────────────────┤
│                                 │                                           │
│  Source Type:                   │  Source Type:                             │
│  ┌─────────┐ ┌─────────┐ ┌────┐│  ┌─────────┐ ┌─────────┐ ┌─────────────┐  │
│  │ Library │ │  File   │ │ DB ││  │ Library │ │  File   │ │  Database   │  │
│  └─────────┘ └─────────┘ └────┘│  └─────────┘ └─────────┘ └─────────────┘  │
│                                 │                                           │
│  Selected Model:                │  Selected Model:                          │
│  ┌───────────────────────────┐ │  ┌───────────────────────────────────────┐│
│  │ Customer_Order_Model      │ │  │ E_Commerce_Enhanced                   ││
│  │ v2.1 • 8 entities         │ │  │ v3.0 • 15 entities                    ││
│  │ 12 relationships          │ │  │ 23 relationships                      ││
│  │ Compatibility: HIGH ●     │ │  │ Compatibility: HIGH ●                 ││
│  └───────────────────────────┘ │  └───────────────────────────────────────┘│
│                                 │                                           │
│  [Browse Model Library]         │  [Browse Model Library]                   │
│                                 │                                           │
└─────────────────────────────────┴───────────────────────────────────────────┘
                                      │
                                      ▼
                              [ Next Step → ]
```

**User Actions:**
1. Select source type for Baseline (Library / File / Database)
2. Click "Browse Model Library" to open model selector
3. Search and select a model from the list
4. Repeat for Target model
5. Click "Next" to proceed

---

### Step 2: Compare Options

**Purpose:** Configure how the comparison should be performed.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            COMPARE OPTIONS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  COMPARISON TYPE                                                            │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │
│  │   Complete     │ │    Schema      │ │    Logical     │ │    Custom    │ │
│  │  (Recommended) │ │   (Fastest)    │ │                │ │  (Advanced)  │ │
│  │                │ │                │ │                │ │              │ │
│  │ ● Full model   │ │ ● Structure    │ │ ● Business     │ │ ● Select     │ │
│  │   comparison   │ │   only         │ │   logic focus  │ │   specific   │ │
│  │ ● All objects  │ │ ● Tables &     │ │ ● Rules &      │ │   elements   │ │
│  │   & metadata   │ │   columns      │ │   constraints  │ │              │ │
│  └────────────────┘ └────────────────┘ └────────────────┘ └──────────────┘ │
│                                                                             │
│  COMPARISON SCOPE                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ○ Bidirectional        - Compare both directions                   │   │
│  │  ○ Baseline → Target    - Changes needed in Target to match Baseline│   │
│  │  ○ Target → Baseline    - Changes needed in Baseline to match Target│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  OUTPUT GENERATION                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ☑ Generate Comparison Report     ☑ Create Delta Model              │   │
│  │  ☐ Generate Sync Script           ☐ Export to Model Mart            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Comparison Types Explained:**

| Type | Description | Use Case |
|------|-------------|----------|
| **Complete** | Full comparison including all objects, properties, and metadata | Comprehensive audits, major releases |
| **Schema** | Structure-focused comparison (tables, columns, keys) | Quick schema validation |
| **Logical** | Business logic comparison (rules, constraints, relationships) | Business requirement validation |
| **Custom** | User-defined comparison scope | Specific use cases |

---

### Step 3: Object Selection

**Purpose:** Select which specific objects to include in the comparison.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           OBJECT SELECTION                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SELECTION MODE                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐           │
│  │   Smart    │ │    All     │ │  Changed   │ │   Conflicts    │           │
│  │ Selection  │ │  Objects   │ │    Only    │ │     Only       │           │
│  └────────────┘ └────────────┘ └────────────┘ └────────────────┘           │
│                                                                             │
│  🔍 Search objects...                                                       │
│                                                                             │
├──────────────────────────────────┬──────────────────────────────────────────┤
│     BASELINE OBJECTS             │        TARGET OBJECTS                    │
├──────────────────────────────────┼──────────────────────────────────────────┤
│                                  │                                          │
│  ▼ ☑ Entities (8)               │  ▼ ☑ Entities (15)                       │
│      ☑ Customer                  │      ☑ Customer                          │
│      ☑ Order                     │      ☑ Order                             │
│      ☑ Product                   │      ☑ Product                           │
│      ☑ Address                   │      ☑ Address                           │
│      ☑ Payment                   │      ☑ Payment                           │
│      ...                         │      ☑ Inventory        ★ NEW            │
│                                  │      ☑ Shipping         ★ NEW            │
│  ▶ ☑ Relationships (12)         │      ...                                  │
│  ▶ ☑ Views (4)                  │  ▶ ☑ Relationships (23)                  │
│  ▶ ☑ Domains (6)                │  ▶ ☑ Views (8)                           │
│                                  │  ▶ ☑ Domains (10)                        │
│                                  │                                          │
├──────────────────────────────────┴──────────────────────────────────────────┤
│                                                                             │
│  SELECTION SUMMARY                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Objects Selected: 58 / 58    Estimated Time: ~2 min                │   │
│  │  Delta Model Size: ~125 KB    Conflicts Detected: 3                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Step 4: Advanced Options

**Purpose:** Configure conflict resolution and delta model settings.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ADVANCED OPTIONS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CONFLICT RESOLUTION STRATEGY                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ● Favor Baseline    - Baseline values take precedence              │   │
│  │  ○ Favor Target      - Target values take precedence                │   │
│  │  ○ Manual Resolution - Review each conflict individually            │   │
│  │  ○ Best Match        - AI-assisted resolution based on patterns     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  DELTA MODEL CONFIGURATION                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Model Name: [ Customer_Order_Enhanced_Delta__________________ ]    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  UNION OPTIONS                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ☑ Include all objects from both models                             │   │
│  │  ☑ Merge compatible objects automatically                           │   │
│  │  ☑ Preserve relationship integrity                                  │   │
│  │  ☐ Add merge metadata to objects                                    │   │
│  │  ☐ Create subject areas for merged content                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Step 5: Results & Actions

**Purpose:** View comparison results and take action.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          COMPARISON RESULTS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ✓ COMPARISON COMPLETE                                                      │
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗ │
│  ║                      EXECUTIVE SUMMARY                                 ║ │
│  ╠═══════════════╤═══════════════╤═══════════════╤═══════════════════════╣ │
│  ║   Objects     │  Differences  │    Matches    │   Compatibility       ║ │
│  ║   Compared    │    Found      │               │                       ║ │
│  ╟───────────────┼───────────────┼───────────────┼───────────────────────╢ │
│  ║      58       │      23       │      35       │       78%             ║ │
│  ║               │               │               │   ████████░░          ║ │
│  ╚═══════════════╧═══════════════╧═══════════════╧═══════════════════════╝ │
│                                                                             │
│  QUICK ACTIONS                                                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────────┐   │
│  │  📄 View Full   │ │  🔀 Create      │ │  📝 Generate Sync Script   │   │
│  │     Report      │ │     Delta Model │ │                             │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────────────────┘   │
│                                                                             │
│  DETAILED RESULTS                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Type        │ Name              │ Status    │ Details               │   │
│  ├─────────────┼───────────────────┼───────────┼───────────────────────┤   │
│  │ Entity      │ Customer          │ ● MATCH   │ Identical structure   │   │
│  │ Entity      │ Order             │ ◐ MODIFIED│ 3 columns changed     │   │
│  │ Entity      │ Inventory         │ + NEW     │ Only in target        │   │
│  │ Entity      │ Legacy_Table      │ - MISSING │ Only in baseline      │   │
│  │ Relationship│ Customer_Orders   │ ⚠ CONFLICT│ Cardinality mismatch  │   │
│  │ ...         │ ...               │ ...       │ ...                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Advanced User Flow (CompleteCompare2 - 2-Step Workflow)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ADVANCED COMPARE WORKFLOW (2-Step)                        │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐         ┌──────────────────┐
                    │     STEP 1       │────────▶│     STEP 2       │
                    │ Source Selection │         │ Compare & Merge  │
                    └──────────────────┘         └──────────────────┘
                           │                            │
                           ▼                            ▼
              ┌────────────────────────┐   ┌────────────────────────┐
              │ • Model Mart Selection │   │ • 28 Comparison Options│
              │ • File Upload (.dmf)   │   │ • Hierarchical Results │
              │ • Database Connection  │   │ • Merge Value Editing  │
              │   (Microsoft Fabric)   │   │ • Export (PDF/Excel)   │
              │ • Connection Testing   │   │ • SQL Script Generation│
              └────────────────────────┘   └────────────────────────┘
```

**Comparison Profiles:**

| Profile | Options Enabled | Best For |
|---------|-----------------|----------|
| **Complete** | All 28 options | Full audit, compliance |
| **Structure** | Tables, columns, keys, indexes | Schema validation |
| **Basic** | Tables and columns only | Quick checks |

---

## UI Elements

### Navigation Components

| Element | Location | Function |
|---------|----------|----------|
| Step Indicator | Top of page | Shows current step (1-5), allows navigation to previous steps |
| Next/Back Buttons | Bottom of page | Navigate between steps |
| Progress Bar | Header | Visual completion percentage |

### Source Selection Elements

| Element | Type | Function |
|---------|------|----------|
| Source Type Tabs | Tab Group | Switch between Library / File / Database |
| Model Browser | Modal | Search and select models from library |
| Model Preview Card | Card | Displays model metadata (entities, relationships, version) |
| Compatibility Badge | Badge | Shows HIGH / MEDIUM / LOW compatibility |
| Browse Button | Button | Opens model selection modal |

### Comparison Configuration Elements

| Element | Type | Function |
|---------|------|----------|
| Compare Type Cards | Selection Cards | Choose Complete / Schema / Logical / Custom |
| Direction Radio Group | Radio Buttons | Select comparison direction |
| Output Checkboxes | Checkboxes | Enable/disable output types |
| Profile Dropdown | Dropdown | Quick profile selection (CompleteCompare2) |
| Option Toggles | Switch Toggles | 28 individual comparison options |

### Results Display Elements

| Element | Type | Function |
|---------|------|----------|
| Summary Cards | Metric Cards | Display key statistics (objects, differences, compatibility) |
| Results Tree | Expandable Tree | Hierarchical view of comparison results |
| Status Badges | Colored Badges | MATCH (green), MODIFIED (amber), NEW (emerald), MISSING (red), CONFLICT (red) |
| Action Buttons | Button Group | View Report, Create Delta, Generate Script |
| Filter Bar | Filter Chips | Filter by object type |
| Search Input | Text Input | Search objects by name |
| Expand/Collapse | Chevron Icons | Toggle tree sections |
| Checkbox Selection | Checkboxes | Select objects for batch operations |

### Visual Indicators

```
Status Colors:
┌─────────────────────────────────────────────────────────────────┐
│  ● MATCH      │ Green (#10b981)  │ Objects are identical        │
│  ◐ MODIFIED   │ Amber (#f59e0b)  │ Objects differ               │
│  + NEW        │ Emerald          │ Only in target               │
│  - MISSING    │ Red (#ef4444)    │ Only in baseline             │
│  ⚠ CONFLICT   │ Red              │ Incompatible changes         │
└─────────────────────────────────────────────────────────────────┘

Model Colors:
┌─────────────────────────────────────────────────────────────────┐
│  Baseline Model  │ Purple (#9333ea)  │ Left side / reference    │
│  Target Model    │ Emerald (#10b981) │ Right side / comparison  │
└─────────────────────────────────────────────────────────────────┘
```

### Supported Object Types (20+)

```
┌────────────────────────────────────────────────────────────────┐
│  Data Objects          │  Code Objects        │  Metadata      │
├────────────────────────┼──────────────────────┼────────────────┤
│  • Entity/Table        │  • Stored Procedure  │  • Annotation  │
│  • Attribute/Column    │  • Function          │  • Diagram     │
│  • Relationship        │  • Trigger           │  • Subject Area│
│  • Key (PK/FK/Unique)  │  • View              │  • Domain      │
│  • Index               │  • Package           │  • UDT         │
│  • Constraint          │  • Sequence          │  • Synonym     │
│  • Schema              │  • Type              │                │
└────────────────────────┴──────────────────────┴────────────────┘
```

---

## Benefits

### For Data Architects

| Benefit | Description |
|---------|-------------|
| **Model Validation** | Ensure model changes align with design standards before deployment |
| **Impact Analysis** | Understand the scope of changes between model versions |
| **Documentation** | Auto-generate comparison reports for audit trails |
| **Conflict Detection** | Identify incompatible changes early in the development cycle |

### For Database Administrators

| Benefit | Description |
|---------|-------------|
| **Schema Synchronization** | Generate SQL scripts to sync database schemas |
| **Migration Planning** | Identify all changes needed for database upgrades |
| **Risk Assessment** | Understand what will change before executing migrations |
| **Rollback Preparation** | Generate reverse scripts for quick rollback if needed |

### For Development Teams

| Benefit | Description |
|---------|-------------|
| **Version Control** | Compare models across different branches or versions |
| **Code Review** | Review data model changes alongside code changes |
| **Merge Support** | Create delta models that combine features from multiple models |
| **Integration Testing** | Validate schema compatibility between environments |

### For Project Managers

| Benefit | Description |
|---------|-------------|
| **Progress Tracking** | Measure compatibility percentage between current and target state |
| **Resource Planning** | Understand scope of work based on difference count |
| **Compliance** | Maintain audit trails of all model changes |
| **Reporting** | Generate executive summaries for stakeholders |

### Key Feature Benefits Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FEATURE                          │  BENEFIT                                │
├───────────────────────────────────┼─────────────────────────────────────────┤
│  Multi-source support             │  Compare from any source (Mart/File/DB) │
│  28 comparison options            │  Granular control over what to compare  │
│  Smart detection                  │  Auto-detect renamed/moved objects      │
│  Delta model creation             │  Merge models without manual work       │
│  SQL script generation            │  Automate schema synchronization        │
│  Multiple export formats          │  Share results in preferred format      │
│  Bidirectional comparison         │  Understand changes from both sides     │
│  Conflict resolution strategies   │  Handle conflicts systematically        │
│  Compatibility percentage         │  Quick assessment of alignment          │
│  Hierarchical results view        │  Navigate complex results easily        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Usage Examples

### Example 1: Validating a Schema Update

**Scenario:** A developer has modified the Customer entity and wants to validate changes before merging.

**Steps:**
1. Navigate to **Complete Compare** from the sidebar
2. Select **Baseline**: `Customer_Order_Model v2.0` from Model Mart
3. Select **Target**: `Customer_Order_Model v2.1` from File upload
4. Choose **Compare Type**: Schema (for faster comparison)
5. Set **Direction**: Target → Baseline (to see what changed)
6. Run comparison
7. Review changes to Customer entity
8. Generate sync script if approved

**Expected Result:**
```
Summary: 3 differences found
- Customer.Email: VARCHAR(100) → VARCHAR(255)
- Customer.Phone: Added nullable column
- Customer.LastLogin: New timestamp column
```

---

### Example 2: Merging Two Feature Branches

**Scenario:** Two teams have developed features on separate model branches that need to be combined.

**Steps:**
1. Open **Complete Compare**
2. Select **Baseline**: `Feature_Inventory_Model`
3. Select **Target**: `Feature_Shipping_Model`
4. Choose **Compare Type**: Complete
5. Set **Direction**: Bidirectional
6. Enable **Object Selection**: All Objects
7. Configure **Union Options**:
   - ☑ Include all objects from both models
   - ☑ Merge compatible objects automatically
   - ☑ Preserve relationship integrity
8. Set **Delta Model Name**: `Combined_Inventory_Shipping_Model`
9. Run comparison
10. Review conflicts (if any)
11. Create delta model

**Expected Result:**
```
Delta Model Created: Combined_Inventory_Shipping_Model
- 15 entities from Inventory branch
- 12 entities from Shipping branch
- 3 shared entities merged
- 0 conflicts (all resolved automatically)
```

---

### Example 3: Database Migration Planning

**Scenario:** Planning a production database upgrade from the current schema to a new design.

**Steps:**
1. Open **Complete Compare**
2. Select **Baseline**: Production database (via Database connection)
3. Select **Target**: New design model from Model Mart
4. Choose **Compare Type**: Complete
5. Enable all **Output Options**:
   - ☑ Generate Comparison Report
   - ☑ Create Delta Model
   - ☑ Generate Sync Script
6. Run comparison
7. Review executive summary:
   - Objects Compared: 156
   - Differences Found: 42
   - Compatibility: 73%
8. Export full report (PDF) for review meeting
9. Generate sync script for DBA team

---

### Example 4: Quick Schema Validation

**Scenario:** Quickly check if two models are in sync.

**Steps:**
1. Open **Quick Compare**
2. Select Source Model: `Dev_Schema`
3. Select Target Model: `QA_Schema`
4. Click **Run Comparison**
5. Filter results by type: Tables
6. Review differences
7. Copy sync SQL for quick fixes

**Expected Result:**
```
Quick Results:
✓ 45 tables match
⚠ 3 tables modified
  - Orders: 2 column differences
  - Products: 1 index difference
  - Users: 1 constraint difference
```

---

### Example 5: Compliance Audit

**Scenario:** Generate documentation for compliance audit showing model evolution.

**Steps:**
1. Open **CompleteCompare2** (Advanced)
2. Select **Left Model**: `Model_v1.0_Approved`
3. Select **Right Model**: `Model_v2.0_Current`
4. Set **Profile**: Complete
5. Enable all comparison options
6. Run comparison
7. Export results:
   - PDF Report for auditors
   - Excel for detailed analysis
   - HTML for web portal
8. Archive with timestamp

**Report Contents:**
```
Compliance Report - Model Evolution Audit
Generated: 2024-01-15 14:30:00

Executive Summary:
- Total Changes: 67
- New Objects: 12
- Modified Objects: 38
- Removed Objects: 17
- Compatibility: 82%

Detailed Change Log:
[Full hierarchical breakdown of all changes]
```

---

## Quick Reference

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Navigate between fields |
| `Enter` | Confirm selection / Proceed |
| `Esc` | Close modal / Cancel |
| `Space` | Toggle checkbox |

### Common Workflows

| Goal | Recommended Path |
|------|------------------|
| Quick validation | Quick Compare → Schema type |
| Full audit | Complete Compare → Complete type |
| Merge models | Complete Compare → Delta model output |
| Generate SQL | Complete Compare → Sync script output |
| Compliance report | CompleteCompare2 → PDF export |

---

---

# Reverse Engineering

<a name="reverse-engineering-overview"></a>
## Overview

**Reverse Engineering** is a powerful feature that allows users to import existing database schemas and automatically generate visual data models. It connects to live databases or parses DDL script files to extract schema information, relationships, and metadata.

The feature provides a guided 3-step wizard experience:

| Step | Purpose | Key Actions |
|------|---------|-------------|
| **Step 1: Select Source** | Choose data source and model type | Connect to DB or upload script |
| **Step 2: Extraction Options** | Configure what to extract | Select preset or customize 34 options |
| **Step 3: Select Objects & Process** | Choose objects and execute | Pick schemas/tables, run extraction |

**Supported Platforms:**
- Microsoft Fabric (Lakehouse & Warehouse) - *Fully Supported*
- MySQL, PostgreSQL, SQL Server - *Supported*
- Oracle, MongoDB - *Coming Soon*

---

<a name="reverse-engineering-user-flow"></a>
## User Flow

### Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       REVERSE ENGINEERING WORKFLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
     │      STEP 1      │────▶│      STEP 2      │────▶│      STEP 3      │
     │  Select Source   │     │ Extraction Options│     │ Objects & Process│
     └──────────────────┘     └──────────────────┘     └──────────────────┘
            │                        │                        │
            ▼                        ▼                        ▼
    ┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
    │ • Database or     │   │ • Choose preset   │   │ • Browse schemas  │
    │   Script source   │   │   (Complete/      │   │ • Select objects  │
    │ • Model type      │   │   Standard/Basic) │   │ • Run extraction  │
    │ • Connection      │   │ • Or customize    │   │ • View results    │
    │   credentials     │   │   34 options      │   │ • Open in editor  │
    └───────────────────┘   └───────────────────┘   └───────────────────┘
```

---

### Step 1: Select Source

**Purpose:** Choose the data source and configure connection settings.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP INDICATOR: ● Source  ○ Options  ○ Objects                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SOURCE TYPE                                                                │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐        │
│  │  🗄️  Database                │  │  📄 Script File              │        │
│  │     Connect to live database │  │     Upload DDL script        │        │
│  │     (selected)               │  │                              │        │
│  └──────────────────────────────┘  └──────────────────────────────┘        │
│                                                                             │
│  MODEL TYPE                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ○ Conceptual    - High-level entity understanding                  │   │
│  │  ○ Logical       - Relationships and business rules                 │   │
│  │  ● Physical      - Implementation details (selected)                │   │
│  │  ○ Logical & Physical - Combined view                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  DATABASE PLATFORM                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🔷 Microsoft Fabric    ✓ Supported                                 │   │
│  │  🐬 MySQL               ✓ Supported                                 │   │
│  │  🐘 PostgreSQL          ✓ Supported                                 │   │
│  │  📊 SQL Server          ✓ Supported                                 │   │
│  │  🔶 Oracle              ⏳ Coming Soon                               │   │
│  │  🍃 MongoDB             ⏳ Coming Soon                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ENVIRONMENT TYPE (Microsoft Fabric)                                        │
│  ┌────────────────────┐  ┌────────────────────┐                            │
│  │  🏠 Lakehouse      │  │  🏢 Warehouse      │                            │
│  │                    │  │     (selected)     │                            │
│  └────────────────────┘  └────────────────────┘                            │
│                                                                             │
│  CONNECTION DETAILS                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Workspace URL:  [ https://fabric.microsoft.com/workspace/...  ]   │   │
│  │  Username:       [ user@company.com__________________________ ]    │   │
│  │  Password:       [ ********__________________________________ ]    │   │
│  │                                                                     │   │
│  │  ☑ Use Single Sign-On (SSO)                                        │   │
│  │                                                                     │   │
│  │  [Test Connection]  ✓ Connected successfully                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  SELECT WAREHOUSE                                                           │
│  [ Sales_Warehouse ▼ ]                                                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                    [Cancel]  [Next: Extraction Options →]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**User Actions:**
1. Select source type: **Database** or **Script File**
2. Choose model type (Conceptual / Logical / Physical / Logical & Physical)
3. Select database platform (e.g., Microsoft Fabric)
4. For Fabric: Choose environment type (Lakehouse / Warehouse)
5. Enter connection credentials or use SSO
6. Click "Test Connection" to verify
7. Select target warehouse from dropdown
8. Click "Next" to proceed

**Validation Rules:**
- Source type must be selected
- Model type must be selected
- For Database: Connection must be successful AND warehouse selected
- For Script: File must be uploaded

**Connection States:**

| State | Visual Indicator |
|-------|------------------|
| Idle | Gray "Test Connection" button |
| Testing | Spinner + "Testing..." text |
| Success | Green checkmark + "Connected successfully" |
| Error | Red X + error message toast |

---

### Step 2: Extraction Options

**Purpose:** Configure which database elements to extract.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP INDICATOR: ✓ Source  ● Options  ○ Objects                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  EXTRACTION PROFILES                                                        │
│                                                                             │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐│
│  │  ⭐ COMPLETE         │ │  📊 STANDARD         │ │  📋 BASIC            ││
│  │                      │ │     (Recommended)    │ │                      ││
│  │  Extract everything  │ │  Tables, views,      │ │  Tables with PK/FK   ││
│  │  including metadata, │ │  constraints, and    │ │  only                ││
│  │  security, triggers  │ │  core relationships  │ │                      ││
│  │                      │ │                      │ │                      ││
│  │  34 options enabled  │ │  22 options enabled  │ │  9 options enabled   ││
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘│
│                                                                             │
│  ▼ ADVANCED OPTIONS (Click to expand)                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  DATABASE OBJECTS                    TABLE COMPONENTS               │   │
│  │  ☑ Tables                           ☑ Columns                      │   │
│  │  ☑ Views                            ☑ Data Types                   │   │
│  │  ☐ Materialized Views               ☑ Default Values               │   │
│  │  ☑ Stored Procedures                ☐ Computed Columns             │   │
│  │  ☑ Functions                        ☑ Identity Columns             │   │
│  │  ☐ System Objects                                                   │   │
│  │                                                                     │   │
│  │  CONSTRAINTS                         INDEXES                        │   │
│  │  ☑ Primary Keys                     ☑ Indexes                      │   │
│  │  ☑ Foreign Keys                     ☑ Clustered Indexes            │   │
│  │  ☑ Unique Constraints               ☑ Unique Indexes               │   │
│  │  ☑ Check Constraints                                                │   │
│  │                                                                     │   │
│  │  RELATIONSHIPS                       DOCUMENTATION                  │   │
│  │  ☑ Reverse Engineer Relationships   ☑ Comments                     │   │
│  │  ☑ Infer from Column Names          ☑ Descriptions                 │   │
│  │  ☑ Detect Many-to-Many              ☑ Extended Properties          │   │
│  │                                                                     │   │
│  │  TRIGGERS                            SECURITY                       │   │
│  │  ☑ Triggers                         ☐ Permissions                  │   │
│  │  ☑ Trigger Definitions              ☐ Roles                        │   │
│  │                                      ☐ Ownership                    │   │
│  │                                                                     │   │
│  │  MODEL GENERATION                                                   │   │
│  │  ☑ Create Logical Model             ☑ Infer Business Names         │   │
│  │  ☑ Create Physical Model            ☐ Normalization Analysis       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Current Profile: Standard (22 options)    [Reset to Default]       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                              [← Back]  [Continue to Object Selection →]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Extraction Profiles:**

| Profile | Options Enabled | Best For |
|---------|-----------------|----------|
| **Complete** | 34 options (all except system objects) | Full database documentation |
| **Standard** | 22 options (tables, views, constraints) | Regular schema import |
| **Basic** | 9 options (tables with PK/FK only) | Quick schema overview |

**Option Categories (34 total):**

| Category | Options |
|----------|---------|
| **Database Objects (6)** | Tables, Views, Materialized Views, Stored Procedures, Functions, System Objects |
| **Table Components (5)** | Columns, Data Types, Default Values, Computed Columns, Identity Columns |
| **Constraints (4)** | Primary Keys, Foreign Keys, Unique Constraints, Check Constraints |
| **Indexes (3)** | Indexes, Clustered Indexes, Unique Indexes |
| **Triggers (2)** | Triggers, Trigger Definitions |
| **Relationships (3)** | Reverse Engineer Relationships, Infer from Column Names, Detect Many-to-Many |
| **Documentation (3)** | Comments, Descriptions, Extended Properties |
| **Security (3)** | Permissions, Roles, Ownership |
| **Model Generation (4)** | Create Logical Model, Create Physical Model, Infer Business Names, Normalization Analysis |

---

### Step 3: Select Objects & Process

**Purpose:** Choose specific database objects and execute reverse engineering.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP INDICATOR: ✓ Source  ✓ Options  ● Objects                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FILTER & SEARCH                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Type: [All ▼] [Tables] [Views]     🔍 Search: [____________]       │   │
│  │                                                                     │   │
│  │  Quick Actions: [Select All]  [Clear All]     12 objects selected  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  SCHEMA BROWSER                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ▼ ☑ dbo (5 objects)                                               │   │
│  │      ☑ Users          TABLE   8 columns   1.2K rows   FK          │   │
│  │      ☑ Products       TABLE   12 columns  5.4K rows   FK          │   │
│  │      ☑ Orders         TABLE   10 columns  15K rows    FK          │   │
│  │      ☑ OrderItems     TABLE   6 columns   45K rows    FK          │   │
│  │      ☑ v_UserOrders   VIEW    5 columns   -                       │   │
│  │                                                                     │   │
│  │  ▶ ☐ sales (3 objects)                                             │   │
│  │                                                                     │   │
│  │  ▼ ☑ inventory (4 objects)                                         │   │
│  │      ☑ Products       TABLE   15 columns  8.2K rows   FK          │   │
│  │      ☑ Warehouses     TABLE   8 columns   24 rows                 │   │
│  │      ☑ StockLevels    TABLE   6 columns   12K rows    FK          │   │
│  │      ☐ v_LowStock     VIEW    4 columns   -                       │   │
│  │                                                                     │   │
│  │  ▶ ☐ hr (2 objects)                                                │   │
│  │  ▶ ☐ analytics (3 objects)                                         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ▼ ADVANCED OPTIONS                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ☐ Include system objects          ☑ Include constraints           │   │
│  │  ☑ Include indexes                 ☑ Include triggers              │   │
│  │  ☑ Reverse engineer relationships  ☑ Include stored procedures     │   │
│  │  ☑ Infer relationships from names  ☐ Create logical model view     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                              [← Back]  [🚀 Start Reverse Engineering]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Processing Phase (After clicking Start):**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    🔄 REVERSE ENGINEERING IN PROGRESS                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ████████████████████████████░░░░░░░░░░░░░░  60%                   │   │
│  │                                                                     │   │
│  │  Current: Detecting relationships...                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Progress Steps:                                                            │
│  ✓ Connecting to database...           (10%)                               │
│  ✓ Reading schema information...       (25%)                               │
│  ✓ Analyzing table structures...       (45%)                               │
│  ● Detecting relationships...          (60%)                               │
│  ○ Generating entity models...         (80%)                               │
│  ○ Finalizing model...                 (95%)                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Success State:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    ✓ REVERSE ENGINEERING COMPLETE                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                         ✓                                          │   │
│  │                    (Large green checkmark)                          │   │
│  │                                                                     │   │
│  │          Created 24 entities with 18 relationships                  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  SUMMARY                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Tables Imported:     18                                            │   │
│  │  Views Imported:      6                                             │   │
│  │  Relationships:       18                                            │   │
│  │  Indexes:             24                                            │   │
│  │  Constraints:         42                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│            [📊 View Model]              [📥 Export]                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

<a name="reverse-engineering-ui-elements"></a>
## UI Elements

### Navigation & Layout

| Element | Type | Function |
|---------|------|----------|
| Step Indicator | Progress Bar | Shows current step with clickable completed steps |
| Navigation Buttons | Button Group | Back / Next / Start buttons |
| Wizard Container | Layout | Consistent header, content, footer structure |

### Source Selection Elements

| Element | Type | Function |
|---------|------|----------|
| Source Type Toggle | Toggle Buttons | Database or Script File selection |
| Model Type Radio | Radio Group | Conceptual / Logical / Physical / Combined |
| Platform Cards | Selection Cards | Database platform selection with badges |
| Environment Toggle | Toggle Buttons | Lakehouse or Warehouse (Fabric) |
| Connection Form | Form | Server, username, password inputs |
| SSO Checkbox | Checkbox | Enable Single Sign-On |
| Test Connection Button | Button | Validates credentials |
| Warehouse Dropdown | Select | Choose target after connection |

### Extraction Options Elements

| Element | Type | Function |
|---------|------|----------|
| Profile Cards | Selection Cards | Quick preset selection |
| Advanced Options Accordion | Collapsible | 34 granular option toggles |
| Option Checkboxes | Checkboxes | Individual extraction toggles |
| Reset Button | Button | Restore default settings |
| Profile Indicator | Badge | Shows current profile name |

### Object Selection Elements

| Element | Type | Function |
|---------|------|----------|
| Type Filter | Dropdown | Filter by All / Tables / Views |
| Search Input | Text Input | Filter objects by name |
| Bulk Actions | Button Group | Select All / Clear All |
| Selection Counter | Badge | Shows "X objects selected" |
| Schema Tree | Expandable Tree | Hierarchical schema browser |
| Schema Checkbox | Checkbox | Select/deselect entire schema |
| Object Row | List Item | Shows name, type, stats, FK badge |
| Advanced Options | Collapsible | Additional extraction settings |

### Processing Elements

| Element | Type | Function |
|---------|------|----------|
| Progress Bar | Animated Bar | Shows completion percentage |
| Status Message | Text | Current operation description |
| Spinner | Animation | Loading indicator |
| Success Icon | Icon | Large green checkmark |
| Summary Panel | Card | Statistics of imported objects |
| Action Buttons | Button Group | View Model / Export |

---

<a name="reverse-engineering-configuration-options"></a>
## Configuration Options

### Complete Options Reference (34 Options)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CATEGORY              │  OPTION                    │  DEFAULT (Standard)   │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  DATABASE OBJECTS      │  Tables                    │  ☑ Enabled            │
│                        │  Views                     │  ☑ Enabled            │
│                        │  Materialized Views        │  ☐ Disabled           │
│                        │  Stored Procedures         │  ☑ Enabled            │
│                        │  Functions                 │  ☑ Enabled            │
│                        │  System Objects            │  ☐ Disabled           │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  TABLE COMPONENTS      │  Columns                   │  ☑ Enabled            │
│                        │  Data Types                │  ☑ Enabled            │
│                        │  Default Values            │  ☑ Enabled            │
│                        │  Computed Columns          │  ☐ Disabled           │
│                        │  Identity Columns          │  ☑ Enabled            │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  CONSTRAINTS           │  Primary Keys              │  ☑ Enabled            │
│                        │  Foreign Keys              │  ☑ Enabled            │
│                        │  Unique Constraints        │  ☑ Enabled            │
│                        │  Check Constraints         │  ☑ Enabled            │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  INDEXES               │  Indexes                   │  ☑ Enabled            │
│                        │  Clustered Indexes         │  ☑ Enabled            │
│                        │  Unique Indexes            │  ☑ Enabled            │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  TRIGGERS              │  Triggers                  │  ☑ Enabled            │
│                        │  Trigger Definitions       │  ☑ Enabled            │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  RELATIONSHIPS         │  Reverse Engineer          │  ☑ Enabled            │
│                        │  Infer from Column Names   │  ☑ Enabled            │
│                        │  Detect Many-to-Many       │  ☑ Enabled            │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  DOCUMENTATION         │  Comments                  │  ☑ Enabled            │
│                        │  Descriptions              │  ☑ Enabled            │
│                        │  Extended Properties       │  ☐ Disabled           │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  SECURITY              │  Permissions               │  ☐ Disabled           │
│                        │  Roles                     │  ☐ Disabled           │
│                        │  Ownership                 │  ☐ Disabled           │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  MODEL GENERATION      │  Create Logical Model      │  ☑ Enabled            │
│                        │  Create Physical Model     │  ☑ Enabled            │
│                        │  Infer Business Names      │  ☑ Enabled            │
│                        │  Normalization Analysis    │  ☐ Disabled           │
└────────────────────────┴────────────────────────────┴───────────────────────┘
```

### Profile Comparison

| Option Category | Complete | Standard | Basic |
|-----------------|----------|----------|-------|
| Tables | ✓ | ✓ | ✓ |
| Views | ✓ | ✓ | ✗ |
| Stored Procedures | ✓ | ✓ | ✗ |
| Primary Keys | ✓ | ✓ | ✓ |
| Foreign Keys | ✓ | ✓ | ✓ |
| Indexes | ✓ | ✓ | ✗ |
| Triggers | ✓ | ✓ | ✗ |
| Relationships | ✓ | ✓ | ✓ |
| Documentation | ✓ | ✓ | ✗ |
| Security | ✓ | ✗ | ✗ |

---

<a name="reverse-engineering-benefits"></a>
## Benefits

### For Data Architects

| Benefit | Description |
|---------|-------------|
| **Rapid Documentation** | Automatically document existing databases in minutes |
| **Visual Understanding** | Convert complex schemas into easy-to-understand diagrams |
| **Relationship Discovery** | Automatically detect and visualize table relationships |
| **Standard Compliance** | Ensure models follow organizational naming conventions |

### For Database Administrators

| Benefit | Description |
|---------|-------------|
| **Schema Inventory** | Complete inventory of all database objects |
| **Impact Analysis** | Understand dependencies before making changes |
| **Migration Planning** | Create models for database migration projects |
| **Documentation** | Generate up-to-date schema documentation |

### For Development Teams

| Benefit | Description |
|---------|-------------|
| **Onboarding** | Help new team members understand database structure |
| **Code Review** | Visual reference for database-related code reviews |
| **API Design** | Inform API design with clear data models |
| **Testing** | Understand data relationships for test planning |

### Key Feature Benefits

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FEATURE                          │  BENEFIT                                │
├───────────────────────────────────┼─────────────────────────────────────────┤
│  Multiple database support        │  Works with Fabric, MySQL, PostgreSQL   │
│  Script file import               │  Import from DDL files without DB access│
│  34 extraction options            │  Fine-grained control over what to import│
│  Relationship inference           │  Auto-detect relationships from naming   │
│  Many-to-many detection           │  Identify junction tables automatically  │
│  SSO authentication               │  Secure enterprise authentication        │
│  Progress tracking                │  Real-time visibility into import status │
│  Preset profiles                  │  Quick setup for common use cases        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

<a name="reverse-engineering-usage-examples"></a>
## Usage Examples

### Example 1: Import Production Database for Documentation

**Scenario:** A DBA needs to document an existing production database.

**Steps:**
1. Open **Reverse Engineering** from sidebar
2. Select **Database** as source type
3. Choose **Physical** model type
4. Select **Microsoft Fabric** → **Warehouse**
5. Enter connection credentials
6. Click **Test Connection** → Verify success
7. Select production warehouse from dropdown
8. Click **Next**
9. Choose **Complete** extraction profile
10. Click **Continue to Object Selection**
11. Click **Select All** to include all objects
12. Click **Start Reverse Engineering**
13. Wait for completion (shows progress)
14. Click **View Model** to open in Diagrammer

**Expected Result:**
```
Reverse Engineering Complete!
Created 45 entities with 38 relationships
- Tables: 35
- Views: 10
- Indexes: 52
- Constraints: 78
```

---

### Example 2: Quick Schema Overview

**Scenario:** A developer needs to quickly understand a database structure.

**Steps:**
1. Open **Reverse Engineering**
2. Select **Database** → **Physical** → **MS Fabric Lakehouse**
3. Connect using SSO
4. Select target lakehouse
5. Choose **Basic** extraction profile (tables with PK/FK only)
6. Select only the relevant schemas (e.g., `dbo`, `sales`)
7. Start reverse engineering
8. View simplified model

**Expected Result:**
```
Quick import completed
Created 12 entities with 8 relationships
```

---

### Example 3: Import from DDL Script

**Scenario:** Import a schema from an exported DDL file without database access.

**Steps:**
1. Open **Reverse Engineering**
2. Select **Script File** as source type
3. Choose **Physical** model type
4. Drag and drop `schema_export.sql` file
5. Click **Next**
6. Choose **Standard** extraction profile
7. Review detected objects
8. Click **Start Reverse Engineering**
9. Export or view model

**Expected Result:**
```
Script parsed successfully
Created 18 entities from DDL script
```

---

---

# Forward Engineering

<a name="forward-engineering-overview"></a>
## Overview

**Forward Engineering** is the process of generating SQL DDL (Data Definition Language) scripts from visual data models. It allows users to deploy models to target databases or generate scripts for manual execution.

The feature provides two implementation variants:

| Variant | Steps | Best For |
|---------|-------|----------|
| **FabricForwardEngineering** | 7-step comprehensive wizard | Microsoft Fabric deployments |
| **ForwardEngineeringNew** | 3-step streamlined wizard | Multi-target deployments |

**Supported Outputs:**
- DDL Script files (.sql)
- Direct deployment to Microsoft Fabric
- JSON, XML, YAML exports
- Markdown documentation

---

<a name="forward-engineering-user-flow"></a>
## User Flow

### Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FORWARD ENGINEERING WORKFLOW                           │
│                        (FabricForwardEngineering)                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Step 1 │→│ Step 2 │→│ Step 3 │→│ Step 4 │→│ Step 5 │→│ Step 6 │→│ Step 7 │
│ Model  │ │  Mode  │ │Options │ │Connect │ │Objects │ │Validate│ │Deploy  │
│Selection│ │Selection│ │        │ │        │ │        │ │        │ │        │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
    │          │          │          │          │          │          │
    ▼          ▼          ▼          ▼          ▼          ▼          ▼
  Select    DDL or    Configure   Fabric    Select     Auto      Generate
  source   Deploy?    45 schema   auth      objects   validate   & deploy
  model               options     via SSO
```

---

### Step 1: Model Selection

**Purpose:** Choose the data model to generate scripts from.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SELECT MODEL                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Available Physical Models                                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ☑ E-Commerce Platform                                    Selected │   │
│  │     15 entities • 12 relationships • Last modified: 2 hours ago    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ☐ CRM Database                                                     │   │
│  │     22 entities • 18 relationships • Last modified: 1 day ago      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ☐ Inventory System                                                 │   │
│  │     8 entities • 6 relationships • Last modified: 3 days ago       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                      [Next: Select Mode →]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Step 2: Execution Mode Selection

**Purpose:** Choose between generating a script file or deploying directly.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SELECT EXECUTION MODE                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐│
│  │                                  │  │                                  ││
│  │         📄                       │  │         ☁️                       ││
│  │                                  │  │                                  ││
│  │    GENERATE DDL FILE             │  │    DEPLOY TO MS FABRIC          ││
│  │                                  │  │                                  ││
│  │    Create SQL script for         │  │    Deploy directly to           ││
│  │    manual deployment             │  │    Microsoft Fabric             ││
│  │                                  │  │                                  ││
│  │    • Download .sql file          │  │    • SSO authentication         ││
│  │    • Review before execution     │  │    • One-click deployment       ││
│  │    • Version control friendly    │  │    • Real-time progress         ││
│  │                                  │  │                                  ││
│  └──────────────────────────────────┘  └──────────────────────────────────┘│
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                    [← Back]  [Next: Schema Options →]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Step 3: Schema Generation Options

**Purpose:** Configure which SQL elements to include in the output.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SCHEMA GENERATION OPTIONS                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  OPTION PRESETS                                                             │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐      │
│  │  ⭐ COMPLETE       │ │  📊 TABLES &       │ │  📋 MINIMAL        │      │
│  │     SCHEMA         │ │     CONSTRAINTS    │ │                    │      │
│  │                    │ │                    │ │  Basic tables      │      │
│  │  All objects +     │ │  Tables, indexes,  │ │  with PKs only     │      │
│  │  security +        │ │  FK constraints    │ │                    │      │
│  │  triggers          │ │                    │ │  7 options         │      │
│  │                    │ │  20 options        │ │                    │      │
│  │  45 options        │ │                    │ │                    │      │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘      │
│                                                                             │
│  ▼ ADVANCED OPTIONS                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  DATABASE & SCHEMA              TABLES                              │   │
│  │  ☑ CREATE DATABASE             ☑ CREATE TABLE                      │   │
│  │  ☐ DROP DATABASE               ☐ DROP TABLE                        │   │
│  │  ☑ CREATE SCHEMA               ☑ Entity Integrity                  │   │
│  │  ☐ DROP SCHEMA                 ☑ Table Validation                  │   │
│  │                                                                     │   │
│  │  COLUMNS                        INDEXES                             │   │
│  │  ☑ Identity Columns            ☑ Primary Key Index                 │   │
│  │  ☑ Default Values              ☑ Alternate Key Index               │   │
│  │  ☐ Computed Columns            ☑ Foreign Key Index                 │   │
│  │                                ☐ DROP INDEX                        │   │
│  │                                ☑ Clustered Index                   │   │
│  │  VIEWS                                                              │   │
│  │  ☑ CREATE VIEW                 REFERENTIAL INTEGRITY               │   │
│  │  ☐ DROP VIEW                   ☑ Foreign Key Constraints           │   │
│  │  ☐ Materialized Views          ☐ DROP Foreign Key                  │   │
│  │                                ☑ Check Constraints                 │   │
│  │  TRIGGERS                      ☑ Unique Constraints                │   │
│  │  ☑ CREATE TRIGGER                                                   │   │
│  │  ☐ DROP TRIGGER                SECURITY                            │   │
│  │  ☐ Relationship Triggers       ☐ GRANT Permissions                 │   │
│  │                                ☐ REVOKE Permissions                │   │
│  │  OTHER                         ☐ CREATE Roles                      │   │
│  │  ☑ Constraint Names            ☐ CREATE Users                      │   │
│  │  ☑ Comments                                                         │   │
│  │  ☑ Quote Names                                                      │   │
│  │  ☐ Owner Names                                                      │   │
│  │  ☑ Qualify Names                                                    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                              [← Back]  [Continue →]                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Step 4: Connection Settings (Deploy Mode Only)

**Purpose:** Authenticate with Microsoft Fabric.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FABRIC CONNECTION                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TARGET ENVIRONMENT                                                         │
│  ┌────────────────────┐  ┌────────────────────┐                            │
│  │  🏠 Lakehouse      │  │  🏢 Warehouse      │                            │
│  │                    │  │     (selected)     │                            │
│  └────────────────────┘  └────────────────────┘                            │
│                                                                             │
│  SELECT WORKSPACE                                                           │
│  [ Production_Workspace ▼ ]                                                │
│                                                                             │
│  AUTHENTICATION                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  [🔐 Sign in with SSO]                                             │   │
│  │                                                                     │   │
│  │  ✓ Connected as user@company.com                                   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                              [← Back]  [Next: Select Objects →]             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Step 5: Object Selection

**Purpose:** Choose which model objects to include in the output.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SELECT OBJECTS                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FILTER & SEARCH                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Type: [All ▼]     🔍 [Search objects...]     8 of 15 selected     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ▼ ☑ dbo (8/10 objects)                                            │   │
│  │      ☑ Users              TABLE                                    │   │
│  │      ☑ Products           TABLE                                    │   │
│  │      ☑ Orders             TABLE                                    │   │
│  │      ☑ OrderItems         TABLE                                    │   │
│  │      ☑ Categories         TABLE                                    │   │
│  │      ☐ AuditLog           TABLE                                    │   │
│  │      ☐ TempData           TABLE                                    │   │
│  │      ☑ v_OrderSummary     VIEW                                     │   │
│  │      ☑ v_ProductStock     VIEW                                     │   │
│  │      ☑ v_CustomerOrders   VIEW                                     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                              [← Back]  [Next: Validate →]                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Step 6: Validation

**Purpose:** Automatically validate the model before deployment.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VALIDATION                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ████████████████████████████████████████████  100%                │   │
│  │                                                                     │   │
│  │  ✓ Validation complete                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  VALIDATION RESULTS                                                         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ❌ ERRORS (2)                                                      │   │
│  │     • Table 'Orders' missing primary key definition                │   │
│  │     • Foreign key 'FK_OrderItems_Products' references invalid table│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ⚠️ WARNINGS (2)                                                    │   │
│  │     • Table 'Users' has no indexes defined                         │   │
│  │     • Column 'email' in 'Users' allows NULL but is unique          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ✓ PASSED (45)                                                      │   │
│  │     All other validations passed                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                              [← Back]  [Next: Preview & Deploy →]           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Step 7: DDL Preview & Deployment

**Purpose:** Review generated DDL and execute deployment.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DDL PREVIEW & DEPLOYMENT                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ▼ DDL PREVIEW (Click to expand)                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  -- Forward Engineering DDL Script                                  │   │
│  │  -- Generated: 2024-01-15 14:30:00                                 │   │
│  │  -- Target: Microsoft Fabric Warehouse                             │   │
│  │  -- Objects: 8 tables, 3 views                                     │   │
│  │                                                                     │   │
│  │  -- Table: Users                                                    │   │
│  │  CREATE TABLE [dbo].[Users] (                                      │   │
│  │      [user_id] INT IDENTITY(1,1) PRIMARY KEY,                      │   │
│  │      [username] NVARCHAR(50) NOT NULL,                             │   │
│  │      [email] NVARCHAR(255) NOT NULL UNIQUE,                        │   │
│  │      [created_at] DATETIME DEFAULT GETDATE()                       │   │
│  │  );                                                                 │   │
│  │  GO                                                                 │   │
│  │                                                                     │   │
│  │  -- Table: Products                                                 │   │
│  │  CREATE TABLE [dbo].[Products] (                                   │   │
│  │      [product_id] INT IDENTITY(1,1) PRIMARY KEY,                   │   │
│  │      [name] NVARCHAR(255) NOT NULL,                                │   │
│  │      [price] DECIMAL(10,2) NOT NULL,                               │   │
│  │      [category_id] INT FOREIGN KEY REFERENCES Categories(id)      │   │
│  │  );                                                                 │   │
│  │  GO                                                                 │   │
│  │  ...                                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  DEPLOYMENT SUMMARY                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Target:    Production_Workspace / Sales_Warehouse                  │   │
│  │  Objects:   8 tables, 3 views, 12 indexes, 6 constraints           │   │
│  │  Script:    245 KB                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│          [📥 Download DDL Script]        [🚀 Deploy to Fabric]             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Deployment Progress:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    🚀 DEPLOYMENT IN PROGRESS                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ████████████████████████░░░░░░░░░░░░░░░░  60%                     │   │
│  │                                                                     │   │
│  │  Current: Creating tables...                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Progress:                                                                  │
│  ✓ Connecting to Fabric...              (10%)                              │
│  ✓ Validating target environment...     (25%)                              │
│  ● Creating tables...                   (60%)                              │
│  ○ Creating views...                    (75%)                              │
│  ○ Creating indexes...                  (85%)                              │
│  ○ Creating constraints...              (95%)                              │
│  ○ Finalizing...                        (100%)                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Success State:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    ✓ DEPLOYMENT COMPLETE                                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                         ✓                                          │   │
│  │                                                                     │   │
│  │          Successfully deployed to Production_Workspace              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  DEPLOYMENT SUMMARY                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Tables Created:      8                                             │   │
│  │  Views Created:       3                                             │   │
│  │  Indexes Created:     12                                            │   │
│  │  Constraints Created: 6                                             │   │
│  │  Total Time:          4.2 seconds                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│            [📊 View in Fabric]              [✓ Done]                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

<a name="forward-engineering-ui-elements"></a>
## UI Elements

### Navigation & Layout

| Element | Type | Function |
|---------|------|----------|
| Step Indicator | Progress Bar | 7-step visual progress |
| Model Cards | Selection Cards | Choose source model |
| Mode Selection Cards | Large Cards | DDL vs Deploy selection |
| Navigation Buttons | Button Group | Back / Next / Deploy |

### Schema Options Elements

| Element | Type | Function |
|---------|------|----------|
| Preset Cards | Selection Cards | Quick preset selection (3 presets) |
| Advanced Options | Collapsible Accordion | 45 individual toggles |
| Option Checkboxes | Checkboxes | Enable/disable DDL elements |
| Category Headers | Section Headers | Group related options |

### Connection Elements (Deploy Mode)

| Element | Type | Function |
|---------|------|----------|
| Environment Toggle | Toggle Buttons | Lakehouse / Warehouse |
| Workspace Dropdown | Select | Choose target workspace |
| SSO Button | Button | Initiate authentication |
| Connection Status | Badge | Shows connected user |

### Object Selection Elements

| Element | Type | Function |
|---------|------|----------|
| Type Filter | Dropdown | Tables / Views / All |
| Search Input | Text Input | Filter by name |
| Selection Counter | Badge | "X of Y selected" |
| Schema Tree | Expandable Tree | Hierarchical object browser |
| Object Checkboxes | Checkboxes | Individual selection |

### Validation Elements

| Element | Type | Function |
|---------|------|----------|
| Progress Bar | Animated Bar | Validation progress |
| Error List | Alert Box (Red) | Critical issues |
| Warning List | Alert Box (Amber) | Non-blocking issues |
| Passed Summary | Alert Box (Green) | Successful checks |

### Deployment Elements

| Element | Type | Function |
|---------|------|----------|
| DDL Preview | Collapsible Code Block | View generated SQL |
| Summary Panel | Info Card | Target and object counts |
| Download Button | Button | Save .sql file |
| Deploy Button | Primary Button | Execute deployment |
| Progress Display | Progress Bar + Messages | Real-time status |
| Success Panel | Success Card | Completion summary |

---

<a name="forward-engineering-configuration-options"></a>
## Configuration Options

### Complete Options Reference (45 Options)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CATEGORY              │  OPTION                    │  DEFAULT              │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  DATABASE & SCHEMA     │  CREATE DATABASE           │  ☑ Enabled            │
│                        │  DROP DATABASE             │  ☐ Disabled           │
│                        │  CREATE SCHEMA             │  ☑ Enabled            │
│                        │  DROP SCHEMA               │  ☐ Disabled           │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  TABLES                │  CREATE TABLE              │  ☑ Enabled            │
│                        │  DROP TABLE                │  ☐ Disabled           │
│                        │  Entity Integrity          │  ☑ Enabled            │
│                        │  Table Check               │  ☑ Enabled            │
│                        │  Table Validation          │  ☑ Enabled            │
│                        │  Physical Storage          │  ☐ Disabled           │
│                        │  Pre-Script                │  ☐ Disabled           │
│                        │  Post-Script               │  ☐ Disabled           │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  COLUMNS               │  Identity Columns          │  ☑ Enabled            │
│                        │  Default Values            │  ☑ Enabled            │
│                        │  Computed Columns          │  ☐ Disabled           │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  INDEXES               │  Primary Key Index         │  ☑ Enabled            │
│                        │  Alternate Key Index       │  ☑ Enabled            │
│                        │  Foreign Key Index         │  ☑ Enabled            │
│                        │  DROP INDEX                │  ☐ Disabled           │
│                        │  Clustered Index           │  ☑ Enabled            │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  VIEWS                 │  CREATE VIEW               │  ☑ Enabled            │
│                        │  DROP VIEW                 │  ☐ Disabled           │
│                        │  Materialized View         │  ☐ Disabled           │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  REFERENTIAL INTEGRITY │  Foreign Key Constraints   │  ☑ Enabled            │
│                        │  DROP Foreign Key          │  ☐ Disabled           │
│                        │  Check Constraints         │  ☑ Enabled            │
│                        │  Unique Constraints        │  ☑ Enabled            │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  TRIGGERS              │  CREATE TRIGGER            │  ☑ Enabled            │
│                        │  DROP TRIGGER              │  ☐ Disabled           │
│                        │  Relationship Triggers     │  ☐ Disabled           │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  SECURITY              │  GRANT Permissions         │  ☐ Disabled           │
│                        │  REVOKE Permissions        │  ☐ Disabled           │
│                        │  CREATE Roles              │  ☐ Disabled           │
│                        │  CREATE Users              │  ☐ Disabled           │
├────────────────────────┼────────────────────────────┼───────────────────────┤
│  OTHER                 │  Constraint Names          │  ☑ Enabled            │
│                        │  Comments                  │  ☑ Enabled            │
│                        │  Quote Names               │  ☑ Enabled            │
│                        │  Owner Names               │  ☐ Disabled           │
│                        │  Qualify Names             │  ☑ Enabled            │
└────────────────────────┴────────────────────────────┴───────────────────────┘
```

### Output Formats (ForwardEngineeringNew)

| Format | Extension | Use Case |
|--------|-----------|----------|
| **DDL Script** | .sql | Standard SQL deployment |
| **JSON** | .json | API integration, automation |
| **XML** | .xml | Legacy systems, SOAP services |
| **YAML** | .yaml | Infrastructure as Code, DevOps |
| **Markdown** | .md | Documentation, README files |

### Naming Conventions

| Convention | Example |
|------------|---------|
| **Preserve** | UserOrders (unchanged) |
| **lowercase** | userorders |
| **UPPERCASE** | USERORDERS |
| **camelCase** | userOrders |
| **snake_case** | user_orders |

---

<a name="forward-engineering-benefits"></a>
## Benefits

### For Data Architects

| Benefit | Description |
|---------|-------------|
| **Model-to-Database** | Deploy visual designs directly to production |
| **Consistent DDL** | Generate standardized SQL every time |
| **Version Control** | Export DDL files for Git tracking |
| **Pre-Deployment Review** | Preview and validate before execution |

### For Database Administrators

| Benefit | Description |
|---------|-------------|
| **Automated Deployment** | One-click deployment to Fabric |
| **Validation** | Catch errors before deployment |
| **Script Archive** | Download DDL for documentation |
| **Environment Flexibility** | Target Lakehouse or Warehouse |

### For Development Teams

| Benefit | Description |
|---------|-------------|
| **CI/CD Integration** | Export scripts for automation pipelines |
| **Multiple Formats** | JSON/YAML for infrastructure tools |
| **Documentation** | Generate Markdown for project docs |
| **Code Review** | Review DDL changes before applying |

### Key Feature Benefits

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FEATURE                          │  BENEFIT                                │
├───────────────────────────────────┼─────────────────────────────────────────┤
│  45 generation options            │  Fine-grained control over output       │
│  3 preset profiles                │  Quick setup for common scenarios       │
│  Direct Fabric deployment         │  Skip manual script execution           │
│  SSO authentication               │  Secure enterprise auth                 │
│  DDL preview                      │  Review before committing               │
│  Auto-validation                  │  Catch errors before deployment         │
│  Multiple output formats          │  DDL, JSON, XML, YAML, Markdown        │
│  Naming conventions               │  5 naming standards supported           │
│  Progress tracking                │  Real-time deployment visibility        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

<a name="forward-engineering-usage-examples"></a>
## Usage Examples

### Example 1: Generate DDL for Code Review

**Scenario:** Generate DDL script for team review before deployment.

**Steps:**
1. Open **Forward Engineering** from sidebar
2. Select model: `E-Commerce Platform`
3. Choose **Generate DDL File** mode
4. Select **Tables & Constraints** preset
5. Click through object selection (select all)
6. Review validation (fix any errors)
7. Preview DDL in code block
8. Click **Download DDL Script**
9. Commit to Git for code review

**Expected Result:**
```
Downloaded: model_export_1705312200000.sql
Size: 245 KB
Contents: 8 CREATE TABLE, 3 CREATE VIEW, 12 CREATE INDEX statements
```

---

### Example 2: Deploy to Microsoft Fabric

**Scenario:** Deploy a data model directly to production warehouse.

**Steps:**
1. Open **Forward Engineering**
2. Select model: `CRM Database`
3. Choose **Deploy to MS Fabric** mode
4. Select **Complete Schema** preset
5. Choose environment: **Warehouse**
6. Select workspace: `Production_Workspace`
7. Click **Sign in with SSO**
8. Select all tables and views
9. Review validation results
10. Preview DDL
11. Click **Deploy to Fabric**
12. Monitor progress
13. Verify success

**Expected Result:**
```
Deployment Complete!
- Tables Created: 22
- Views Created: 8
- Indexes Created: 35
- Constraints Created: 18
- Total Time: 6.4 seconds
```

---

### Example 3: Export for DevOps Pipeline

**Scenario:** Generate YAML export for infrastructure automation.

**Steps:**
1. Open **Forward Engineering** (ForwardEngineeringNew)
2. Select **File** as target type
3. Choose output format: **YAML**
4. Select model: `Inventory System`
5. Enable options:
   - ☑ Include comments
   - ☑ Include indexes
   - ☑ Include constraints
6. Set naming convention: `snake_case`
7. Click **Generate**
8. Download YAML file

**Expected Result:**
```yaml
# model_export_1705312200000.yaml
tables:
  - name: products
    columns:
      - name: product_id
        type: INT
        primary_key: true
      - name: product_name
        type: VARCHAR(255)
        nullable: false
    indexes:
      - name: idx_products_name
        columns: [product_name]
```

---

## Quick Reference

### Comparison: Reverse vs Forward Engineering

| Aspect | Reverse Engineering | Forward Engineering |
|--------|---------------------|---------------------|
| **Direction** | Database → Model | Model → Database |
| **Input** | Existing DB or DDL script | Visual data model |
| **Output** | Visual diagram | SQL DDL script or deployment |
| **Use Case** | Document existing schemas | Deploy new schemas |
| **Steps** | 3-step wizard | 7-step wizard (Fabric) |

### Common Workflows

| Goal | Feature | Recommended Path |
|------|---------|------------------|
| Document existing DB | Reverse Engineering | Standard preset → All objects |
| Deploy to Fabric | Forward Engineering | Complete preset → Deploy mode |
| Generate DDL file | Forward Engineering | DDL mode → Download |
| Quick schema overview | Reverse Engineering | Basic preset → Key tables only |
| CI/CD integration | Forward Engineering | YAML/JSON export |

---

*Document Version: 1.1*
*Last Updated: January 2026*
*Feature Locations:*
- *Complete Compare: `src/components/CompleteCompare.tsx`, `CompleteCompare2.tsx`, `QuickCompare.tsx`*
- *Reverse Engineering: `src/components/ReverseEngineeringNew.tsx`*
- *Forward Engineering: `src/components/FabricForwardEngineering.tsx`, `ForwardEngineeringNew.tsx`*
