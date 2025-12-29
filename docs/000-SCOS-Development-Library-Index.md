# SCOS Development ALTC & WFB Framework Library
**version** 1.1
**Last Updated**: 2025-12-22

## Purpose

This is your **Strategy and Framwork Documentation Library** — the core framework artifacts that can be referenced to understand the Website First Blueprint (WFB) and Authority Led Topic Cluser (ALTC) Framework and other supporting concepts required to develop the Strategic Content Operating System Software.

---

## The Framework & Implementation Documents

##Shared Documents
Key Documents are shared between Framework development, Business Strategy Development, Content Creation and other AI tools and systems. This Library Index relys on the following shared docuemtns from the "Single Source of truth" (SSOT) stored on github.com

**location:** brighter-frameworks-docs\frameworks\

1. WFB-Blueprint-Overview.md
3. ALTC-Framework-Definitions.md

**location:** brighter-frameworks-docs\implementation

4. SCOS-Conceptual-Overview.md
4. SCOS-architecture.md (in review)
6. AI-First-Implementation-Reference.md
brighter-frameworks-docs\implementation\module-specifications\airtable-database\proof-library-airtable-implementation.md

**location:** brighter-frameworks-docs\

5. Proprietary-Terminology-Reference.md
brighter-frameworks-docs\GLOSSARY.md
brighter-frameworks-docs\NAMING_CONVENTIONS.md

**location:**  brighter-frameworks-docs\technical

brighter-frameworks-docs\technical\01-proof-library.md
brighter-frameworks-docs\technical\02-CAR-schema.md
brighter-frameworks-docs\technical\03-CAM-structure.md
brighter-frameworks-docs\technical\05-page-directives.md
brighter-frameworks-docs\technical\06-integration-map.md

**location:** mu-brighter-support-main\mu-brighter-support-main\

**New Documentation Structure (2025-12-16)**:
1. **MODULE_REFERENCE.md** - Single source of truth for module status
2. **IMPLEMENTATION_ROADMAP.md** - High-level roadmap (what to build, when)
3. **TECHNICAL_ARCHITECTURE.md** - System architecture (how it works)
4. **DEVELOPMENT_GUIDE.md** - Development protocols, testing, ways of working
5. **PRODUCT_STRATEGY.md** - Product vision, tiers, philosophy
6. **.claude\claude-context.md** - Quick reference for Claude Code

**Implementation Guides**:
- **READING_TIME_IMPLEMENTATION.md** - Step-by-step guide for extending Content Analysis module with reading time & views tracking (ready to implement)

**Deployment**:
- DEPLOYMENT.md

**Scripts & Migration**:
- **Shortcodes.md** - Current custom scripts for reading time, word count, views (⏳ to be migrated to Content Analysis module, SEOPress integration to be removed in Phase 6)

**Deprecated (Historical Reference Only)**:
- ~~MODULES_OVERVIEW.md~~ → Use MODULE_REFERENCE.md
- ~~REFACTOR_PLAN.md~~ → Use IMPLEMENTATION_ROADMAP.md + DEVELOPMENT_GUIDE.md
- ~~STRATEGY.md~~ → Use PRODUCT_STRATEGY.md + MODULE_REFERENCE.md
- ~~DOCUMENTATION_ANALYSIS.md~~ → Restructure complete, can delete





### 1. Website-First Blueprint (WFB) Methodology
**File**: `WFB-Methodology.md`
**SSOT Location**: brighter-frameworks-docs\frameworks\WFB-Blueprint-Overview.md

**What it covers**:
- The operational philosophy and constraint-based implementation framework
- Five pillars (Technical Foundations, Conversion Infrastructure, Content Strategy, Channel Integration, Compounding Systems)
- How ALTC sits within WFB
- Origin story and differentiation
- When to use WFB thinking

**Use this when**:
- Explaining overall marketing strategy
- Deciding where to invest resources first
- Understanding how all systems work together
- Positioning your methodology to clients

---

### 2. ALTC Framework Definitions
**File**: `ALTC-Framework-Definitions.md`
**SSOT Location**: brighter-frameworks-docs\frameworks\ALTC-Framework-Definitions.md

**What it covers**:
- Precise operational definitions of all framework components
- The 8 Authority Anchors (detailed)
- Supporting concepts (Complexity Filter, Maturity Levels, Voice Gaps, etc.)
- How AI should reference these definitions

**Use this when**:
- Need precise definition of a specific term
- Evaluating content against Authority Anchors
- Training AI systems on framework vocabulary
- Ensuring consistent terminology across implementations

---

### 3. SCOS Conceptual Overview
**File**: `SCOS-Conceptual-Overview.md`
**SSOT Location**: brighter-frameworks-docs\implementation\SCOS-Conceptual-Overview.md

**What it covers**:

---

### 4. Implementation Documentation (This Repo)

**Documentation Restructure - 2025-12-16**

The implementation documentation has been reorganized into 6 focused documents:

#### 4.1 MODULE_REFERENCE.md
**Purpose**: Single source of truth for module status  
**Update Frequency**: After any module work

**What it covers**:
- Complete module list with status (✅ Active, 🚧 In Progress, 📋 Planned, 💡 Future)
- Current features per module
- Planned features per module
- Future ideas per module
- Module dependencies
- Last updated dates
- Migration status (legacy vs. modular code)

**Use this when**:
- Need current status of any module
- Planning work (check what's already built)
- Understanding module dependencies
- Reconciling conflicting status information

---

#### 4.2 IMPLEMENTATION_ROADMAP.md
**Purpose**: High-level roadmap (what to build, when)  
**Update Frequency**: After phase completion

**What it covers**:
- Phase overview (0-8)
- What's complete, in progress, planned, future
- Phase dependencies
- Current focus
- Next steps
- Milestone checklists
- Success metrics
- Timeline estimates

**Use this when**:
- Need to know what's next
- Planning sprints/phases
- Understanding phase dependencies
- Tracking overall progress

---

#### 4.3 TECHNICAL_ARCHITECTURE.md
**Purpose**: System architecture and design patterns  
**Update Frequency**: When architecture changes (rare)

**What it covers**:
- Four-layer architecture (Content → Execution → Intelligence → CAM)
- CAR (Content Architecture Record) schema
- Module system architecture
- Module Interface requirements
- Performance philosophy
- MCP-first design patterns
- Security considerations
- Technical stack

**Use this when**:
- Need to understand how the system works
- Designing new features
- Making architectural decisions
- Onboarding new developers

---

#### 4.4 DEVELOPMENT_GUIDE.md
**Purpose**: Development protocols and practices  
**Update Frequency**: When new patterns emerge

**What it covers**:
- Ways of Working (Clarify, Debug, MCP-First)
- Development protocols (code standards, module interface)
- Testing protocols (per-module, site-wide)
- Refactoring/migration protocols
- Common issues & solutions
- Security requirements
- Performance requirements

**Use this when**:
- Starting development work
- Debugging issues
- Testing changes
- Migrating modules
- Reviewing code

---

#### 4.5 PRODUCT_STRATEGY.md
**Purpose**: Product vision, philosophy, long-term direction  
**Update Frequency**: Quarterly or when strategy shifts

**What it covers**:
- Product vision (short/medium/long-term)
- Product tiers (Basic/Pro/Agency)
- Product principles
- Target markets
- Competitive positioning
- Revenue model
- Go-to-market strategy
- Future features wishlist

**Use this when**:
- Making product decisions
- Understanding target market
- Pricing discussions
- Competitive analysis
- Long-term planning

---

#### 4.6 CLAUDE_CONTEXT.md
**Purpose**: Quick reference for Claude Code  
**Update Frequency**: When major context changes

**What it covers**:
- Project overview (3-4 sentences)
- Current phase and status
- Documentation structure guide
- Quick reference tables
- Common tasks
- Key concepts
- Directory structure
- When to use which doc

**Use this when**:
- Starting work on the project
- Need quick orientation
- Don't know which doc to read
- Need high-level overview

---

### 4.7 SCOS architecture (External)
**File**: `SCOS-architecture.md`
**SSOT Location**: brighter-frameworks-docs\implementation\SCOS-architecture.md

**What it covers**:
- The 4-layer architecture (Content Architecture → Execution → Intelligence → Brain)
- CAR (Content Architecture Record) detailed specification
- CAM (Content Authority Map) - what it tracks and why
- Module system and dependencies
- Performance optimization approach (disabled = not loaded)
- MCP-first design principles
- Tier system (Basic, Pro, Agency)
- Module reference (all 10+ modules documented)
- Development roadmap and phases

**Use this when**:
- Understanding technical implementation
- Extending or building new modules
- Marketing technical innovation
- Training developers on architecture

---

### 5. Proprietary Terminology Reference
**File**: `Proprietary-Terminology-Reference.md`
**SSOT Location**: brighter-frameworks-docs\Proprietary-Terminology-Reference.md

**What it covers**:
- All proprietary terms and their definitions
- Trademark priority ranking
- Usage guidelines
- The 4 layers of SCOS explained
- CAR and CAM detailed definitions
- Naming decisions and rationale

**Use this when**:
- Need precise definition of technical term
- Deciding what to trademark
- Ensuring consistent terminology
- Training team on proper usage

---

### 6.  AI-First SCOS Development Implementation Reference
**File**: `AI-First-Implementation-Reference.md `
**SSOT Location**: brighter-frameworks-docs\implementation\AI-First-Implementation-Reference.md

**What it covers**:
- AI first positioning
- AI-era integration points 
- AI-era implementation and use patterns

**Used in frameworks and software when**:
- Considering New or changed Requirements 
- Considering New or changed use cases 
- Identifying future enhancement oppurtunities
- Identifying Integration points


## Repository Structure

### Single Source of Truth (SSOT)

**Documentation SSOT**: `E:\GIT_REPOS\brighter-frameworks-docs/` (GitHub)
- All framework definitions
- All implementation guides
- All technical specifications
- Update docs here only

**Code SSOT**: `E:\GIT_REPOS\mu-brighter-support-main/` (GitHub)
- WordPress MU plugin code
- Modular architecture
- Deployment scripts
- Code changes only (docs excluded via .gitignore)

### Folder Structure

```
E:\GIT_REPOS\
├── mu-brighter-support-main/          ← CODE REPO (GitHub synced)
│   ├── brighter-core/                ← Legacy code
│   ├── site-essentials/              ← New modular code
│   │   ├── Core/                     ← Core classes
│   │   ├── Modules/                  ← Feature modules
│   │   └── Views/                    ← Admin UI templates
│   ├── *.php                         ← Plugin loaders
│   ├── deploy.sh                     ← Deployment scripts
│   └── .gitignore                    ← Excludes all docs
│
└── brighter-frameworks-docs/          ← DOCS REPO (GitHub synced)
    ├── frameworks/                   ← Framework definitions
    │   ├── ALTC-Framework-Definitions.md
    │   ├── WFB-Blueprint-Overview.md
    │   └── relationship-map.md
    ├── implementation/               ← Implementation guides
    │   ├── SCOS-architecture.md
    │   ├── SCOS-Conceptual-Overview.md
    │   ├── AI-First-Implementation-Reference.md
    │   └── module-specifications/
    ├── technical/                    ← Technical specs
    │   ├── 01-proof-library.md
    │   ├── 02-CAR-schema.md
    │   ├── 03-CAM-structure.md
    │   ├── 04-llm-txt-format.md
    │   ├── 05-page-directives.md
    │   └── 06-integration-map.md
    ├── Playbooks/                    ← Operational guides
    ├── GLOSSARY.md                   ← Quick terminology
    └── Proprietary-Terminology-Reference.md  ← Detailed terms
```

### Development Files (Local Only, Not in Git)

These exist locally in `mu-brighter-support-main/` but are excluded from Git:
- `IMPLEMENTATION_ROADMAP.md` - Development roadmap
- `MODULE_REFERENCE.md` - Module status
- `TECHNICAL_ARCHITECTURE.md` - System architecture
- `DEVELOPMENT_GUIDE.md` - Development protocols
- `PRODUCT_STRATEGY.md` - Product vision
- `READING_TIME_IMPLEMENTATION.md` - Implementation guide
- `Shortcodes.md` - Legacy scripts reference
- `docs/history/` - Historical documentation

**Why Excluded**: Development/implementation docs not needed in production deployment.

---

## Document Relationships

```
Website-First Blueprint (WFB)
├── Pillar 1: Technical Foundations
├── Pillar 2: Conversion Infrastructure
├── Pillar 3: Content Strategy ← ALTC FRAMEWORK LIVES HERE
│   ├── ALTC Framework Overview (why and how)
│   └── ALTC Framework Definitions (precise terms)
├── Pillar 4: Social Amplification Loop (Content Engine)
└── Pillar 5: Compounding Systems (maturity evolution)

Strategic Content Operating System (SCOS)
├── Layer 1: Content Architecture ← WFB + ALTC frameworks
├── Layer 2: Execution Layer ← WordPress plugin implementation
│   ├── Module system
│   ├── CAR (per-post strategy)
│   └── Integration tools
├── Layer 3: Intelligence Layer ← Analytics and insights
└── Layer 4: CAM (The Brain) ← Site-wide intelligence
```

---


## Quick Reference Guide

### Strategy & Frameworks
- **"I need to explain the overall methodology"** → `WFB-Blueprint-Overview.md`
- **"I need to explain the content strategy approach"** → `ALTC-Framework-Definitions.md`
- **"I need the definition of a specific term"** → `ALTC-Framework-Definitions.md` or `Proprietary-Terminology-Reference.md`
- **"I need to understand SCOS Conceptually"** → `SCOS-Conceptual-Overview.md`
- **"I need to understand the technical implementation"** → `SCOS-architecture.md`
- **"I need to decide ALTC vs SLTC"** → `ALTC-Framework-Definitions.md` → ALTC vs SLTC section
- **"I need to understand Authority Anchors"** → `ALTC-Framework-Definitions.md` → The 8 Authority Anchors
- **"I need to explain maturity progression"** → `ALTC-Framework-Definitions.md` → Maturity Progression section
- **"I need to understand CAR or CAM"** → `SCOS-Conceptual-Overview.md` → CAR/CAM sections
- **"I need to understand voice gaps"** → `ALTC-Framework-Definitions.md` → Voice Gaps
- **"I need to know what to trademark"** → `Proprietary-Terminology-Reference.md` → Trademark Priority

### Implementation & Development
- **"What's the current status?"** → `MODULE_REFERENCE.md` (local only)
- **"What's next to build?"** → `IMPLEMENTATION_ROADMAP.md` (local only)
- **"How does the system work?"** → `TECHNICAL_ARCHITECTURE.md` (local only)
- **"How do I develop/test?"** → `DEVELOPMENT_GUIDE.md` (local only)
- **"Where is [specific document]?"** → Check `brighter-frameworks-docs/` first
- **"Where is the code?"** → `mu-brighter-support-main/`
- **"How do I deploy?"** → `DEPLOYMENT.md` and `GIT_SETUP_GUIDE.md`

### For AI/Coding Tools

**When Working on Code**:
- Code location: `mu-brighter-support-main/`
- Reference docs: `brighter-frameworks-docs/`

**Examples**:
- Implementing ALTC system → Reference `brighter-frameworks-docs/frameworks/ALTC-Framework-Definitions.md`
- Writing module code → Use `mu-brighter-support-main/site-essentials/Modules/`
- Understanding CAR schema → Reference `brighter-frameworks-docs/technical/02-CAR-schema.md`
- Checking module status → Reference `mu-brighter-support-main/MODULE_REFERENCE.md` (local only)

**When Updating Documentation**:
- Framework docs → `brighter-frameworks-docs/frameworks/`
- Implementation guides → `brighter-frameworks-docs/implementation/`
- Technical specs → `brighter-frameworks-docs/technical/`
- **Don't update**: Documentation in `mu-brighter-support-main/` (excluded from Git, local reference only)

---

## For Business-Specific Implementations

These framework docs are **universal**. For each client/business, create:

1. **ALTC Implementation Doc** (e.g., "ALTC Implementation - Brighter Websites")
   - Which specific ALTCs are being used
   - Maturity targets for each cluster
   - Specific Authority Anchor applications
   - Service pathway connections
   - Current state and next actions

2. **Content Engine Strategy** (e.g., "Content Engine - Brighter Websites")
   - How content flows through channels
   - Social amplification workflows
   - Email nurture sequences
   - Automation systems

3. **Brand Voice Guide** (e.g., "Brand Voice - Brighter Websites")
   - Tone and style rules
   - Humanization techniques
   - Vocabulary preferences
   - Content templates

4. **SCOS Configuration** (e.g., "SCOS Setup - Brighter Websites")
   - Which modules enabled
   - Tier selection (Basic/Pro/Agency)
   - CAR schema customizations
   - Integration settings

**These implementation docs REFERENCE the framework library but contain business-specific details.**

---

## Version Control

**Change Log**:
- v1.0 (2025-12-04): Initial framework library creation
  - Includes origin story from keyword overwhelm breakthrough
  - Includes WFB relationship clarification
  - Includes Neil Patel validation context
  - Added SCOS Technical Overview
  - Added Proprietary Terminology Reference
  - Finalized CAM naming (Content Authority Map)
  
- v1.1 (2025-12-22): Repository structure and Git setup
  - Added explicit SSOT section (code vs docs repos)
  - Added folder structure visual map
  - Added practical AI/Coding Tools examples
  - Merged DOCUMENTATION_REFERENCE.md content (eliminated duplication)
  - Expanded Quick Reference Guide with implementation docs
  - Clarified local-only vs Git-synced documentation
  - Updated Github repo path of SSOT Location
  - Usage: Where SSOT can not be used, upload copy. Ensure Version and Dates are present for all shared documents
  - Renamed SCOS Technical Overview to SCOS Technical Architecture Overview
  - Added SCOS Conceptual Overview


**Future Enhancements Planned**:
- ALTC Implementation Guide (diagnostic process)
- Case Study Template (proof documentation)
- Maturity Assessment Tool
- Voice Gap Analysis Framework
- Module Development Guide
- CAR Schema Finalization Tool

---

## Usage Guidelines

### For AI Systems

These documents are designed for AI consumption. When training a new AI helper:

1. Load all three framework docs into knowledge base
2. Emphasize these are REFERENCE docs, not implementation instructions
3. Business-specific implementation comes from separate docs
4. Use precise terminology from Definitions doc
5. Apply strategic thinking from Overview doc
6. Understand context from WFB Methodology doc
7. Ensure Version Number increments and Date updated when any shared document is changed. Add notification after changes are completed to remind SSOT updates occure immediately 

### For Clients

When onboarding a new client:

1. Share **WFB Methodology** to explain overall approach
2. Share **ALTC Framework Overview** if using ALTC strategy
3. Keep **Definitions** doc as internal reference
4. Create client-specific implementation doc
5. Use framework docs as proof of systematic methodology

### For Partners/Certification

When training others to use the framework:

1. All three docs are essential reading
2. Framework docs are shareable (your IP)
3. Implementation examples show application
4. Case studies demonstrate proof
5. Certification requires demonstrating understanding

---

## Key Differentiators

**What makes this framework library valuable**:

1. **Systematic** - Not ad-hoc advice, but structured methodology
2. **Proven** - Guerrilla Steel case study validates approach
3. **Operational** - Precise definitions enable consistent application
4. **Reusable** - Same framework applies across clients/industries
5. **AI-native** - Designed for both human and AI consumption
6. **Intellectual Property** - Your proprietary methodology

**This is not just documentation. This is your competitive moat.**

---

## Contact & Attribution

**Creator**: Vanessa Wood, Brighter Websites  
**Website**: brighterwebsites.com.au/altc-framework  
**Framework Origin**: 2022-2023 (keyword overwhelm breakthrough)  
**First Implementation**: Guerrilla Steel (2024)  
**Validation**: Neil Patel + industry leaders independently reaching same conclusions

**Copyright**: © 2024 Brighter Websites. Framework is proprietary intellectual property.

---

*This framework library represents years of practical experience distilled into systematic methodology. Use it strategically.*
