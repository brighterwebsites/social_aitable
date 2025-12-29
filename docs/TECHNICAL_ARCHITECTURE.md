# Technical Architecture

**Purpose**: System architecture and design patterns (stable reference)  
**Last Updated**: 2025-12-16  
**Update Frequency**: When architecture changes (rare)

**Note**: This document describes HOW the system works. For WHAT to build and WHEN, see IMPLEMENTATION_ROADMAP.md. For module status, see MODULE_REFERENCE.md.

---

## System Overview

**Site Essentials** is a WordPress MU Plugin implementing a modular architecture where each feature can be independently enabled/disabled for performance and flexibility.

**Core Innovation**: Every piece of content knows exactly what it's supposed to do strategically (via CAR), and the site-wide intelligence layer (CAM) keeps all AI tools calibrated.

---

## The Four-Layer Architecture

This system operates in 4 conceptual layers:

```
Layer 1: Content Architecture (Strategic Framework)
    ↓
Layer 2: Execution Layer (Operational Tools)
    ↓
Layer 3: Intelligence Layer (Insight Generation)
    ↓
Layer 4: Content Authority Map (CAM) - The Brain
```

### Layer 1: Content Architecture (Strategic Framework)
**Purpose**: Defines WHAT to create and WHY

**Nature**: Strategic frameworks, not executable code. Lives in documentation.

**Components**:
- ALTC Framework (positioning-first content strategy)
- WFB Methodology (website-centric marketing philosophy)
- Authority Anchors (8 proof mechanisms)
- Content Maturity Map (6-level progression)
- Service Pathways (commercial alignment)

**Location**: External documentation (`brighter-frameworks-docs/`)

---

### Layer 2: Execution Layer (Operational Tools)
**Purpose**: Implements HOW to execute the strategy

**Components**:

**WordPress MU Plugin**:
- Module loader with dependency management
- Settings manager (unified settings system)
- Cache helper (standardized caching)
- Admin UI (single settings page with module toggles)

**Modules** (See MODULE_REFERENCE.md for full list):
- Performance, Analytics, Content Strategy, SEO, Business Info, FAQ, Social Amplification, etc.

**External Integrations**:
- ALTC Content Generator (GPT) - Content creation
- ALTC Fast Track (Claude Project) - Strategy generation
- Make.com Automations - Distribution workflows
- GA4 - Attribution and tracking

**Key Principle**: If module disabled, its code never loads (zero performance impact)

---

### Layer 3: Intelligence Layer (Insight Generation)
**Purpose**: Transforms execution data into strategic insights

**Components**:
- Topic Risk Analysis (cannibalization detection)
- Content Stats Dashboard
- Maturity Distribution Analytics
- Authority Anchor Coverage tracking
- Performance Attribution (which content drives conversions)

**Data Sources**:
- CAR data from all posts
- GA4 analytics events
- Internal linking analysis
- Content optimization status

**Performance Design**: Analysis runs once, then stops. Reminder triggers if:
- Analysis hasn't run in X days
- Page last modified > last analysis timestamp

---

### Layer 4: Content Authority Map (CAM) - The Brain
**Purpose**: The brain that keeps all AI tools calibrated and maintains strategic alignment

**What CAM Tracks**:
- ALTC map (which clusters exist, maturity distribution)
- Topic saturation index (coverage by cluster)
- Authority Anchors distribution
- Content-to-service pathway alignment
- Performance contribution to offline sales
- Content velocity and update cycles
- Internal linking maturity
- Cannibalization weak spots
- Purpose diversity, intent diversity
- AI tool calibration timestamps

**Why CAM is Critical**:
Without Layer 4, AI tools (GPT, Claude) drift and lose calibration every 2-3 months. CAM maintains alignment by:
- Aggregating all CAR data site-wide
- Providing strategic context to AI tools
- Tracking what content exists vs. what's needed
- Identifying gaps and opportunities
- Maintaining consistency across tools

**Status**: Conceptually defined, not yet built

---

## Content Architecture Record (CAR)

**What it is**: Per-post/page metadata stored as JSON in WordPress postmeta that explicitly defines every content piece's strategic position.

**Why it matters**: Makes implicit strategy explicit and machine-readable. Every piece of content knows exactly what it's supposed to do.

### CAR Schema

**Storage**: WordPress postmeta key `_scos_car`  
**Format**: JSON blob  
**Updated**: Automatically on post save, manually via admin interface

```json
{
  "version": "1.0.0",
  "last_updated": "2025-12-04T10:30:00Z",
  
  "content_strategy": {
    "altc_cluster": "AI-First SEO & Future-Proof Visibility",
    "maturity_level": "professional",
    "content_topic": "GEO implementation",
    "content_intent": "educational",
    "content_purpose": "authority_building",
    "pillar_page_id": 123,
    "pillar_type": "cluster_hub"
  },
  
  "user_journey": {
    "journey_stage": "consideration",
    "persona_target": "Growth-driven SME owner"
  },
  
  "authority_proof": {
    "authority_anchors": [1, 2, 4],
    "proof_elements": ["guerrilla_steel_case_study", "schema_tutorial", "framework_explanation"]
  },
  
  "commercial": {
    "service_pathway": "Future-Proof Growth Website",
    "conversion_goal": "quote_request",
    "secondary_goal": "newsletter_signup"
  },
  
  "cro_elements": {
    "cro_elements_present": ["primary_cta", "secondary_cta", "proof_block", "faq_section"],
    "cta_hierarchy": {
      "main": ".ga-cta-main",
      "micro": ".ga-cta-micro",
      "assist": ".ga-cta-email"
    }
  },
  
  "content_quality": {
    "humanization_flags": {
      "ai_words_found": ["utilize", "leverage"],
      "contractions_present": true,
      "sentence_length_variance_score": 0.78,
      "ai_detection_score": 8
    },
    "optimization_status": "optimized"
  },
  
  "seo": {
    "locality": "Ballarat, VIC",
    "breadcrumbs": "seo > ai-seo > geo-implementation",
    "schema_types": ["Article", "HowTo", "FAQPage"]
  },
  
  "performance": {
    "word_count": 2847,
    "internal_links_out": 12,
    "internal_links_in": 8,
    "external_links": 5,
    "images": 4,
    "videos": 1
  },
  
  "analytics": {
    "ga4_tracked": true,
    "custom_dimensions": {
      "content_intent": "educational",
      "content_purpose": "authority_building",
      "content_topic": "geo_implementation"
    }
  }
}
```

### CAR Fields Reference

**content_strategy**:
- `altc_cluster`: Which ALTC cluster this content belongs to
- `maturity_level`: Entry | Learner | Practitioner | Professional | Expert | Industry Authority
- `content_topic`: Specific topic within cluster
- `content_intent`: Educational | Commercial | Navigational | Transactional
- `content_purpose`: Authority Building | Conversion | Support | Education
- `pillar_page_id`: Parent pillar page (if applicable)
- `pillar_type`: Cluster Hub | Topic Hub | Supporting Content | Standalone

**user_journey**:
- `journey_stage`: Awareness | Consideration | Decision | Retention | Advocacy
- `persona_target`: Which persona this content targets

**authority_proof**:
- `authority_anchors`: Array of Authority Anchor IDs (1-8) utilized
- `proof_elements`: Specific proof elements included

**commercial**:
- `service_pathway`: Which service/product this content leads to
- `conversion_goal`: Primary conversion goal
- `secondary_goal`: Alternative conversion path

**cro_elements**:
- `cro_elements_present`: Array of CRO elements on page
- `cta_hierarchy`: CSS selectors for main/micro/assist CTAs

**content_quality**:
- `humanization_flags`: AI detection avoidance metrics
- `optimization_status`: 14 possible statuses

**seo**:
- `locality`: Geographic targeting
- `breadcrumbs`: URL structure for shortlinks
- `schema_types`: Schema.org types implemented

**performance**:
- Content metrics (word count, links, media)

**analytics**:
- GA4 integration flags and custom dimensions

**Full Schema Documentation**: See `brighter-frameworks-docs/technical/02-CAR-schema.md`

---

## Module System Architecture

### Module Interface

All modules implement `Module_Interface`:

```php
namespace SiteEssentials\Core;

interface Module_Interface {
    // Module metadata
    public static function get_id();           // Module slug (e.g., 'seo')
    public static function get_name();         // Display name
    public static function get_description();  // What it does
    public static function get_tier();         // basic | pro | agency
    public static function get_dependencies(); // Required modules
    public static function get_version();      // Module version
    
    // Module lifecycle
    public function init();                    // Initialize (if enabled)
    public function render_settings();         // Settings UI
}
```

### Module Lifecycle

```
1. Registration
   Module class registered with Module_Loader

2. Check Enabled
   Settings_Manager checks if module enabled

3. Check Dependencies
   Module_Loader verifies dependencies met

4. Load
   If enabled + dependencies met, instantiate module

5. Initialize
   Call init() method

6. Hooks
   Module registers WordPress hooks/filters
```

**Key Principle**: If module disabled, its code never loads (performance).

### Module Dependencies

**Example Dependency Chain**:
```
Analytics Module
├── Optional: Business Info (for region data)
├── Optional: Content Strategy (for ALTC dimensions)
└── Works standalone with reduced features

Content Strategy Module
├── Requires: Business Info (for service pathways)
├── Optional: Analytics (for performance tracking)
└── Independent of SEO module

Social Amplification Module
├── Requires: Business Info (for shortlinks)
├── Optional: Content Strategy (for content type detection)
└── Independent REST API
```

**Dependency Resolution**:
- Module_Loader checks dependencies at load time
- Shows clear admin notice if required module disabled
- Optional dependencies gracefully degrade features

---

## Performance Philosophy

### Core Principle: Disabled = Not Loaded

**Implementation**:
```php
// Module loader only requires file if enabled
if ($settings->is_module_enabled('analytics')) {
    require_once SCOS_PATH . 'modules/analytics/Analytics_Module.php';
    $module = new \SiteEssentials\Modules\Analytics\Analytics_Module();
    $module->init();
}
```

**Result**: Zero performance impact from disabled modules.

### Caching Strategy

**Cache_Helper** standardizes caching across all modules:

```php
// Get cached data or execute expensive operation
$data = Cache_Helper::remember('business_info', function() {
    return expensive_database_query();
}, 3600); // 1 hour cache
```

**Cache Invalidation**:
- Automatic on post save/update
- Automatic on settings change
- Manual flush available
- Per-module cache groups

**Cache Methods**:
- `Cache_Helper::get($key, $group)` - Get from cache
- `Cache_Helper::set($key, $value, $expiration, $group)` - Set cache
- `Cache_Helper::delete($key, $group)` - Delete from cache
- `Cache_Helper::flush($group)` - Flush cache group
- `Cache_Helper::remember($key, $callback, $expiration, $group)` - Get or set

### Query Optimization

**Benchmarks**:
- Admin page load: < 500ms
- Frontend overhead: < 50ms
- Query count increase: < 5 queries
- Memory usage: < 10MB increase

**Monitoring**: Query Monitor plugin used for profiling

**Optimization Techniques**:
- Batch-load post meta (reduces N queries to 1-4)
- Transient caching for expensive operations
- Lazy-load admin scripts (only on relevant pages)
- No-found-rows optimization (when total count not needed)

### Analysis Features Performance

**Problem**: Content analysis running continuously = performance hit

**Solution**:
- Run once, then stop
- Store results in post meta
- Reminder if not run in X days
- Reminder if page modified > last analysis
- Batch processing (5-10 posts at a time)

---

## MCP-First Design Principles

**Model Context Protocol (MCP)** is Anthropic's protocol for AI agent integration. The system is designed for easy MCP integration in future.

### Current Architecture (REST API)
```
Make.com → REST API → generate_prompt() → ChatGPT → Response → Parse
```

### Future Architecture (MCP)
```
Claude → MCP Tool: generate_social_post() → WordPress → Structured Response
```

### MCP-First Design Pattern

**Separate Interface from Business Logic**:

```php
// ✅ Good: Business logic separate
class Social_Post_Generator {
    public function generate($platform, $content_id) {
        // Core logic here
        return $post_data;
    }
}

// REST API uses it
class Social_API {
    public function endpoint_generate() {
        $generator = new Social_Post_Generator();
        return $generator->generate($_POST['platform'], $_POST['content_id']);
    }
}

// Future MCP tool uses same logic
class Social_MCP_Tool {
    public function tool_generate_social_post($params) {
        $generator = new Social_Post_Generator();
        return $generator->generate($params['platform'], $params['content_id']);
    }
}
```

**Key Principle**: No code duplication. MCP layer calls existing classes.

---

## Tier System

### Basic (Free)
**Included Modules**:
- Performance (WordPress tweaks, image optimization)
- Basic Analytics (GA4 tracking)
- Basic SEO (sitemaps)
- Business Info
- WordPress Tweaks

**Target**: All client sites by default  
**Value**: Foundation features that improve every site

---

### Pro (Paid)
**Additional Modules**:
- Full Analytics (enhanced tracking, lead hierarchy)
- Content Strategy (ALTC, optimization tracking)
- Advanced SEO (meta, schema, canonical)
- FAQ System
- Content Analysis
- Custom Post Types
- API Access
- Social Amplification

**Target**: Clients with active content strategy  
**Value**: Tools for content-driven businesses

---

### Agency (Paid - Premium)
**Additional Modules**:
- Support Portal (branded)
- Site Monitoring
- White-label Options
- Priority Support
- Multi-site License
- Custom Development

**Target**: Agencies managing multiple clients  
**Value**: Client management tools

---

## Database Schema

### Post Meta Keys (Legacy)
**Legacy code** uses these keys (will migrate to CAR in Phase 4):

**ALTC/Content Strategy**:
- `bw_primary_altc_id` - Primary ALTC cluster ID
- `bw_primary_topic_id` - Primary topic ID
- `bw_cont_maturity` - Content maturity level
- `bw_intent` - Content intent (11 types)
- `bw_purpose` - Content purpose (12 types)
- `_brt_opt_status` - Optimization status (14 states)
- `bw_index_status` - Index status (5 states)
- `bw_pillar_page_id` - Pillar page relationship

**Content Analysis**:
- `bw_word_count` - Word count (content only, no headers/footers)
- `bw_reading_time` - Reading time in minutes (based on 200 wpm)
- `bw_reading_time_iso` - ISO 8601 duration format (e.g., "PT5M")
- `bw_internal_link_count` - Internal link count
- `bw_external_link_count` - External link count
- `bw_internal_links` - Internal link URLs (serialized)
- `bw_external_links` - External link URLs (serialized)
- `bw_h2_count` - H2 heading count
- `bw_image_count` - Image count
- `bw_views_count` - Post view counter (privacy-friendly, no cookies)
- `bw_last_viewed` - Last viewed timestamp

**Social Amplification**:
- `bw_breadcrumbs` - Short title for YOURLS shortlinks

**Performance**:
- `bw_preload_assets` - Assets to preload (serialized array)

### Post Meta Keys (Future - CAR)
**Phase 4** will consolidate into single CAR:
- `_scos_car` - Content Architecture Record (JSON blob)

All legacy keys will be migrated to CAR structure.

### Options Keys

**Core Settings**:
- `site_essentials_settings` - Core settings (enabled modules, tier)

**Per-Module Settings**:
- `site_essentials_{module_id}` - Per-module settings
- Examples:
  - `site_essentials_analytics`
  - `site_essentials_seo`
  - `site_essentials_business_info`

**Legacy Settings** (will migrate):
- `brighter_ga4_measurement_id` - GA4 tracking ID
- `brighter_business_info_*` - Business info fields (27 fields)
- `brighter_faq_settings` - FAQ system settings

**Deprecated Fields** (to remove after migration):
- `post_wordcount` → Replaced by `bw_word_count`
- `post_reading_minutes` → Replaced by `bw_reading_time`
- `post_reading_iso` → Replaced by `bw_reading_time_iso`
- `post_tags_array` → Temporary for SEOPress, remove in Phase 6
- ACF `post_views_count` → Replaced by `bw_views_count`

### Taxonomies

**ALTC Taxonomies**:
- `altc_strategic_lens` - ALTC clusters
- `altc_topic` - ALTC topics

**Custom Post Types**:
- `faq` - FAQ post type
- `talking_points` - Social amplification prompts
- `project` - Portfolio items (site-specific)
- `news` - News items

---

## Settings System

### Settings Architecture

**Central Storage**: `wp_options` table with keys:
- `site_essentials_settings` - Core settings (enabled modules, tier)
- `site_essentials_{module_id}` - Per-module settings

**Settings Manager** (Singleton):
- `Settings_Manager::instance()` - Get instance
- `$settings->is_module_enabled($module_id)` - Check if module enabled
- `$settings->enable_module($module_id)` - Enable module
- `$settings->disable_module($module_id)` - Disable module
- `$settings->get($key, $default)` - Get setting
- `$settings->set($key, $value)` - Set setting
- `$settings->export()` - Export settings (JSON)
- `$settings->import($json)` - Import settings

### Settings Import/Export

**Export Format**: JSON

```json
{
  "version": "1.0.0",
  "site_essentials_core": {
    "enabled_modules": ["performance", "analytics", "seo"],
    "tier": "pro"
  },
  "site_essentials_analytics": {
    "ga4_measurement_id": "G-XXXXXXXXXX",
    "enhanced_tracking": true,
    "lead_scoring": true
  },
  "site_essentials_business_info": {
    "business_name": "Example Business",
    "phone_number": "555-1234"
  }
}
```

**Import Logic**:
- Validate JSON structure
- Check version compatibility
- Allow selective import (checkboxes for each module)
- Preview before import
- Backup existing settings before import

---

## Security Considerations

**API Authentication**: API key-based (OAuth 2.0 planned)  
**Nonce Verification**: All form submissions  
**Capability Checks**: `manage_options` for settings  
**Data Sanitization**: All user inputs sanitized  
**SQL Injection Prevention**: Prepared statements  
**XSS Prevention**: `esc_html()`, `esc_attr()` everywhere  
**CSRF Protection**: WordPress nonces on all forms

---

## Technical Stack

**Language**: PHP 7.4+  
**Framework**: WordPress MU Plugin  
**Architecture**: PSR-4 Autoloading, Namespaced  
**Caching**: WordPress Object Cache (WP_Cache)  
**Analytics**: Google Analytics 4 (GA4)  
**Automation**: Make.com, Custom REST API  
**Performance**: Query Monitor for profiling  
**Version Control**: Git  
**Hosting**: CyberPanel, LiteSpeed optimization

**External Integrations**:
- ChatGPT (via API for content generation)
- Claude (via Projects for strategy)
- YOURLS (shortlink service)
- Postly (future social scheduling)
- SEOPress (temporary, being replaced)

---

## Directory Structure

```
wp-content/mu-plugins/
├── site-essentials.php              # Main loader (~20 lines)
└── site-essentials/                 # Main plugin folder
    ├── core/
    │   ├── Module_Interface.php     # Interface all modules implement
    │   ├── Module_Loader.php        # Loads & manages modules
    │   ├── Settings_Manager.php     # Unified settings system
    │   ├── Cache_Helper.php         # Standardized caching
    │   └── Admin_UI.php             # Main settings page
    ├── modules/                     # Modules go here
    │   ├── seo/                     # Example: SEO Module
    │   │   ├── Seo_Module.php       # Module main class
    │   │   ├── views/
    │   │   │   └── settings.php     # Settings UI
    │   │   └── README.md
    │   └── [other modules]/
    ├── includes/                    # Shared utilities
    │   └── helpers.php
    ├── assets/
    │   ├── css/
    │   │   └── admin.css
    │   └── js/
    │       └── admin.js
    └── README.md
```

### Naming Conventions

**Namespace**: `SiteEssentials\{Layer}\{Component}`
- Core: `SiteEssentials\Core\Module_Loader`
- Modules: `SiteEssentials\Modules\Seo\Seo_Module`

**File Names**: 
- Classes: `Class_Name.php` (capitalized, underscores)
- Views: `settings.php` (lowercase, hyphens if multi-word)

**Class Names**:
- Classes: `Class_Name` (PascalCase)
- Methods: `method_name()` (snake_case)
- Properties: `$property_name` (snake_case)

---

## Data Flow

```
WordPress Content (Post, Page, CPT)
    ↓
Custom Fields (ALTC, Strategy, Metrics) - CAR
    ↓
REST API / MCP Server (future)
    ↓
AI Agent (Claude, Custom GPT)
    ↓
Analysis / Actions
    ↓
Make.com/N8N Orchestration
    ↓
Social Media (distribution) + Google Sheets (tracking)
    ↓
GA4 Analytics (performance measurement)
    ↓
Looker Studio (reporting)
    ↓
Intelligence Layer (insights back to CAM)
```

---

## Integration Points

### WordPress Core
- Custom post types and taxonomies
- Post meta (CAR storage)
- Options API (settings storage)
- REST API (custom endpoints)
- Admin UI (settings pages, meta boxes)
- Hooks/Filters (WordPress lifecycle)
- Rewrite rules (sitemap endpoints)

### External Services
- **GA4**: Event tracking, custom dimensions
- **Make.com**: Webhooks, automation workflows
- **ChatGPT**: Content generation via API
- **Claude**: Strategy generation (Projects)
- **YOURLS**: Shortlink generation
- **SEOPress**: Temporary integration (⏳ Remove in Phase 6)
  - Filter: `seopress_dyn_variables_fn`
  - Exposes custom fields via `%%_cf_FIELDNAME%%` syntax in schema
  - Currently used for: Article schema (wordCount, timeRequired, keywords)
  - Fields: `bw_word_count`, `bw_reading_time_iso`, `post_tags_array`
  - **Migration**: Phase 6 SEO Module will replace with native schema
  - **Code location**: `Shortcodes.md` (lines 112-141) - marked for removal

### Future Integrations
- **MCP Server**: AI agent protocol
- **Postly**: Social media scheduling
- **N8N**: Alternative to Make.com
- **Airtable**: Proof Library integration

---

## Related Documentation

**Strategic Frameworks** (external):
- `brighter-frameworks-docs/frameworks/WFB-Blueprint-Overview.md`
- `brighter-frameworks-docs/frameworks/ALTC-Framework-Definitions.md`
- `brighter-frameworks-docs/Proprietary-Terminology-Reference.md`
- `brighter-frameworks-docs/GLOSSARY.md`

**Implementation Docs** (this repo):
- `MODULE_REFERENCE.md` - Detailed status of each module
- `IMPLEMENTATION_ROADMAP.md` - What to build and when
- `DEVELOPMENT_GUIDE.md` - Development protocols
- `PRODUCT_STRATEGY.md` - Product vision and tiers
- `CLAUDE_CONTEXT.md` - Quick reference

**Technical Specs** (external):
- `brighter-frameworks-docs/technical/02-CAR-schema.md` - CAR schema detail
- `brighter-frameworks-docs/technical/03-CAM-structure.md` - CAM structure
- `brighter-frameworks-docs/implementation/SCOS-Conceptual-Overview.md` - SCOS category definition
- `brighter-frameworks-docs/implementation/AI-First-Implementation-Reference.md` - AI-era patterns

---

**End of Technical Architecture**

*This document describes stable architecture. For roadmap/status, see other docs.*

