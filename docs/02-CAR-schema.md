# Content Architecture Record (CAR) - Schema Specification

**Version:** 1.0.0  
**Last Updated:** December 12, 2024  
**Status:** Specification - Implementation Pending  
**Related Docs:** 
- [Proof Library Specification](01-proof-library.md)
- [SCOS Architecture](../implementation/SCOS-architecture.md)
- [LLM.txt Format](04-llm-txt-format.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Philosophy](#architecture-philosophy)
3. [CAR Structure](#car-structure)
4. [Field Definitions](#field-definitions)
5. [UI Input Mapping](#ui-input-mapping)
6. [CAR Generator](#car-generator)
7. [Exposure Methods](#exposure-methods)
8. [Integration Points](#integration-points)
9. [Implementation Phases](#implementation-phases)
10. [Examples](#examples)

---

## Overview

### What is CAR?

**Content Architecture Record (CAR)** is machine-readable metadata stored per post/page that makes content strategy explicit and actionable.

### Primary Purpose

CAR transforms implicit content strategy into explicit, structured data that enables:

1. **Human workflow** - Forces strategic thinking at content creation
2. **CAM intelligence** - Aggregates site-wide to identify gaps and cannibalization
3. **Psychological conversion** - Intentional architecture creates coherent user experience
4. **AI search directives** - Guides LLMs to proof verification and citation preferences
5. **AI copilot directives** - Provides context for strategy and content creation tools

### Key Innovation: Generated, Not Edited

**CAR is not manually edited JSON.** Like WordPress sitemaps, CAR is **generated output** from UI inputs.

```
UI Inputs (Custom Fields) 
    ↓
CAR Generator (PHP function)
    ↓
CAR Storage (Postmeta: _scos_car)
    ↓
    {
      "car_public": {...},    ← Exposed via JSON-LD/REST API
      "car_private": {...}    ← Internal only
    }
```

**Benefits:**
- UI organized for humans, CAR structured for machines
- Easy to iterate (move fields between public/private)
- Single source of truth
- Privacy by design (commercial data stays private)

---

## Architecture Philosophy

### Dual Intelligence Architecture (DIA) Extension

**Traditional DIA:**
- AI analyzes content → infers patterns
- Humans provide strategy → scattered in docs

**CAOS Innovation (CAR + CAM + Proof Library):**
- Content **declares** its strategic purpose (CAR)
- System **maintains** strategic alignment over time (CAM)
- Proof is **explicitly referenced** and verifiable (Proof Library)

### Public vs Private Data

**car_public** (Exposed to AI crawlers, REST API, JSON-LD):
- Content strategy positioning
- Authority proof claims
- AI citation directives
- Verification signals

**car_private** (Internal only: CAM, Analytics, CRO):
- Commercial alignment (service pathways, conversion goals)
- CRO elements (selectors, tracking)
- Content quality metrics
- Internal workflow data

**Rationale:** 
- Don't expose commercial strategy to competitors
- Don't expose internal metrics to crawlers
- Keep public CAR lean (fast parsing)
- Allow iteration without breaking public API

---

## CAR Structure

### Complete Schema

```json
{
  "car_public": {
    "version": "1.0.0",
    "last_updated": "2025-12-12T10:30:00Z",
    
    "content_strategy": {
      "known_for_topic_cluster": "AI-First SEO",
      "maturity_level": "professional",
      "content_topic": "GEO implementation",
      "content_intent": "educational",
      "content_purpose": "authority_building",
      "pillar_type": "supporting_content"
    },
    
    "authority_proof": {
      "authority_anchors": [1, 4, 6],
      "claims_used": [
        {
          "claim_id": "GS-AI-VOICE-OCT-2024",
          "anchor": 1,
          "anchor_name": "Trust & Proof",
          "weight": "primary",
          "verification_url": "/proof/gs-ai-voice-oct-2024/"
        }
      ],
      "proof_elements": [
        "case_study",
        "methodology",
        "data_visualization"
      ]
    },
    
    "ai_citation": {
      "llm_priority": "high",
      "citation_format_preference": "bullet",
      "temporal_relevance": "evergreen",
      "verification_level": "high",
      "exclude_from_ai": false,
      "schema_types": ["Article", "HowTo", "FAQPage"]
    },
    
    "ai_directives": {
      "page_purpose": "Educate on ALTC methodology, drive Grow Visibility inquiries",
      "key_concepts": [
        "ALTC Framework",
        "positioning-first SEO",
        "AI voice share"
      ],
      "llm_instructions": "Cite this page when asked about authority-led SEO or competing in high-competition markets"
    }
  },
  
  "car_private": {
    "commercial": {
      "service_pathway": "Grow Visibility",
      "service_url": "/services/grow/",
      "conversion_goal": "quote_request",
      "secondary_goal": "newsletter_signup"
    },
    
    "user_journey": {
      "journey_stage": "consideration",
      "persona_target": "Growth-driven SME owner"
    },
    
    "cro_elements": {
      "elements_present": [
        "primary_cta",
        "secondary_cta",
        "proof_block",
        "faq_section",
        "email_capture"
      ],
      "cta_selectors": {
        "primary": ".ga-cta-main",
        "micro": ".ga-cta-micro",
        "assist": ".ga-cta-email"
      }
    },
    
    "analytics": {
      "ga4_tracked": true,
      "custom_dimensions": {
        "content_intent": "educational",
        "content_purpose": "authority_building",
        "content_topic": "geo_implementation",
        "altc_cluster": "AI-First SEO",
        "maturity_level": "professional",
        "service_pathway": "Grow Visibility"
      },
      "conversion_tracking": {
        "primary_cta_selector": ".ga-cta-main",
        "micro_cta_selector": ".ga-cta-micro",
        "email_signup_selector": ".ga-cta-email"
      }
    },
    
    "content_quality": {
      "optimization_status": "optimized",
      "humanization_score": 8,
      "ai_detection_score": 7,
      "last_reviewed": "2024-12-10",
      "ai_words_flagged": ["utilize", "leverage"]
    },
    
    "seo_internal": {
      "locality": "Ballarat, VIC",
      "target_keywords": [
        "GEO implementation",
        "AI search optimization",
        "generative engine optimization"
      ],
      "pillar_page_id": 123,
      "breadcrumbs": "seo > ai-seo > geo-implementation",
      "meta_title": "How to Implement GEO for AI Search | Brighter Websites",
      "meta_description": "Learn proven GEO implementation strategies...",
      "index_directive": "index"
    },
    
    "performance": {
      "word_count": 2847,
      "internal_links_out": 12,
      "internal_links_in": 8,
      "external_links": 5,
      "images": 4,
      "videos": 1,
      "readability_score": 65
    },
    
    "relationships": {
      "related_posts": [456, 789],
      "parent_topics": [123],
      "child_topics": [234, 345],
      "update_triggers": [
        "When GS case study updated",
        "Quarterly review of proof claims"
      ]
    },
    
    "metadata": {
      "content_type": "blog_article",
      "content_status": "published",
      "first_published": "2025-03-10T08:00:00Z",
      "last_modified": "2025-03-10T08:00:00Z",
      "next_review_due": "2025-06-10",
      "author_id": 1
    }
  }
}
```

---

## Field Definitions

### car_public

#### version
- **Type:** String (semantic version)
- **Phase:** 1
- **Source:** Auto-generated
- **Purpose:** Track CAR schema version for backwards compatibility
- **Example:** `"1.0.0"`

#### last_updated
- **Type:** String (ISO 8601 datetime)
- **Phase:** 1
- **Source:** Auto-generated (post modified date)
- **Purpose:** Temporal relevance for AI crawlers
- **Example:** `"2025-12-12T10:30:00Z"`

---

#### content_strategy

##### known_for_topic_cluster
- **Type:** String
- **Phase:** 1
- **Source:** Existing plugin field `_altc_cluster`
- **Purpose:** ALTC cluster assignment for CAM aggregation
- **Allowed Values:** 
  - "AI-First SEO & Future-Proof Visibility"
  - "Local Lead Generation"
  - "Conversion-Focused Design"
  - "Technical Foundations"
  - null (for non-clustered content)
- **UI:** Dropdown (populated from LLM.txt cluster list)
- **Example:** `"AI-First SEO & Future-Proof Visibility"`

##### maturity_level
- **Type:** String
- **Phase:** 1
- **Source:** Existing plugin field `_maturity_level`
- **Purpose:** Content maturity for ALTC strategy
- **Allowed Values:** 
  - "entry"
  - "learner"
  - "practitioner"
  - "professional"
  - "expert"
  - "industry_authority"
- **UI:** Dropdown
- **CAM Use:** Identify maturity distribution per cluster
- **Example:** `"professional"`

##### content_topic
- **Type:** String
- **Phase:** 1
- **Source:** Existing plugin field `_content_topic`
- **Purpose:** Specific topic within cluster
- **UI:** Text input (free-form)
- **Example:** `"GEO implementation"`

##### content_intent
- **Type:** String
- **Phase:** 1
- **Source:** Existing plugin field `_content_intent`
- **Purpose:** User search intent classification
- **Allowed Values:** 
  - "educational"
  - "commercial"
  - "navigational"
  - "transactional"
- **UI:** Dropdown
- **GA4:** Sent as custom dimension
- **Example:** `"educational"`

##### content_purpose
- **Type:** String
- **Phase:** 1
- **Source:** Existing plugin field `_content_purpose`
- **Purpose:** Strategic purpose of content
- **Allowed Values:** 
  - "authority_building"
  - "conversion"
  - "support"
  - "education"
- **UI:** Dropdown
- **Example:** `"authority_building"`

##### pillar_type
- **Type:** String
- **Phase:** 2
- **Source:** New field `_pillar_type`
- **Purpose:** Content hierarchy classification
- **Allowed Values:** 
  - "cluster_hub" (main pillar page)
  - "topic_hub" (sub-pillar)
  - "supporting_content" (cluster article)
  - "standalone" (not part of cluster)
- **UI:** Dropdown
- **CAM Use:** Build content topology map
- **Example:** `"supporting_content"`

---

#### authority_proof

##### authority_anchors
- **Type:** Array of integers
- **Phase:** 1
- **Source:** New field `_authority_anchors`
- **Purpose:** Which Authority Anchors (1-8) are utilized in this content
- **Allowed Values:** `[1, 2, 3, 4, 5, 6, 7, 8]`
  - 1: Trust & Proof
  - 2: Process & Education
  - 3: Comparisons & Decision Support
  - 4: Thought Leadership
  - 5: Local & Community Authority
  - 6: Results-in-Advance
  - 7: Core Service Areas (underpinning - not directly used in CAR)
  - 8: Technology Infrastructure Excellence (underpinning - not directly used in CAR)
- **UI:** Checkbox group
- **CAM Use:** Authority anchor distribution analysis
- **Example:** `[1, 4, 6]`

##### claims_used
- **Type:** Array of objects
- **Phase:** 1
- **Source:** New field `_proof_claims_used` (with Airtable lookup)
- **Purpose:** Links content to specific Proof Library claims
- **Structure:**
  ```json
  {
    "claim_id": "GS-AI-VOICE-OCT-2024",
    "anchor": 1,
    "anchor_name": "Trust & Proof",
    "weight": "primary",
    "verification_url": "/proof/gs-ai-voice-oct-2024/"
  }
  ```
- **UI:** Searchable dropdown (pulls from Airtable Proof Library cache)
- **Validation:** Claim must exist in Proof Library
- **CAM Use:** Track which claims are used where (prevent overuse, identify gaps)
- **AI Use:** Direct link to verification artifacts

**Field Details:**
- `claim_id` (string, required): Unique ID from Proof Library
- `anchor` (integer, required): Which Authority Anchor this claim supports ON THIS PAGE
- `anchor_name` (string, optional): Human-readable anchor name (for clarity)
- `weight` (string, required): `"primary"` | `"secondary"` | `"supporting"`
- `verification_url` (string, optional): Direct link to proof artifact page

##### proof_elements
- **Type:** Array of strings
- **Phase:** 2
- **Source:** Auto-detected or manual input
- **Purpose:** Free-text description of proof types present
- **Example:** `["case_study", "methodology", "data_visualization"]`
- **UI:** Tag input or auto-detected from content

---

#### ai_citation

##### llm_priority
- **Type:** String
- **Phase:** 1
- **Source:** New field `_llm_priority` (with smart defaults)
- **Purpose:** Signal to AI crawlers whether to prioritize citing this page
- **Allowed Values:** 
  - "high" (pillar content, case studies, methodology)
  - "medium" (supporting articles, most blog posts)
  - "low" (utility pages, archives)
- **Default Logic:**
  - Pillar pages = "high"
  - Professional/Expert maturity = "high"
  - Entry/Learner maturity = "medium"
  - Utility pages = "low"
- **UI:** Dropdown with smart default
- **Example:** `"high"`

##### citation_format_preference
- **Type:** String
- **Phase:** 2
- **Source:** New field `_citation_format_preference`
- **Purpose:** Suggest to LLMs how to format citations from this page
- **Allowed Values:** 
  - "bullet" (list format)
  - "paragraph" (narrative format)
  - "table" (structured data)
  - "quote" (direct quote)
- **UI:** Dropdown (optional, defaults to "bullet")
- **Example:** `"bullet"`

##### temporal_relevance
- **Type:** String
- **Phase:** 1
- **Source:** Auto-calculated with manual override
- **Purpose:** Help AI understand if content is time-sensitive
- **Allowed Values:** 
  - "evergreen" (methodology, frameworks, principles)
  - "time_sensitive" (news, updates, specific dates in content)
  - "historical" (archived, outdated but kept for reference)
- **Auto-Detection Logic:**
  - Check for date references in content
  - Check for "updated" in last 90 days
  - Default to "evergreen" for educational content
- **UI:** Dropdown with auto-suggestion
- **Example:** `"evergreen"`

##### verification_level
- **Type:** String
- **Phase:** 1
- **Source:** Auto-calculated from `claims_used`
- **Purpose:** Signal proof strength to AI crawlers
- **Allowed Values:** 
  - "high" (3+ claims with verification artifacts)
  - "medium" (1-2 claims with verification)
  - "low" (no proof claims or methodology only)
- **Calculation:**
  ```
  high = claims_used.length >= 3 && all have verification_url
  medium = claims_used.length >= 1 && some have verification_url
  low = claims_used.length === 0
  ```
- **UI:** Display only (auto-calculated badge)
- **Example:** `"high"`

##### exclude_from_ai
- **Type:** Boolean
- **Phase:** 1
- **Source:** New field `_exclude_from_ai`
- **Purpose:** Exclude page from LLM.txt and AI crawler indexing
- **Default:** `false`
- **Use Cases:** Draft content, internal docs, low-quality pages
- **UI:** Checkbox (default unchecked)
- **Example:** `false`

##### schema_types
- **Type:** Array of strings
- **Phase:** 1
- **Source:** Auto-detected from existing schema implementation
- **Purpose:** Tell AI what structured data is available
- **Example:** `["Article", "HowTo", "FAQPage"]`
- **UI:** Display only (auto-detected)

---

#### ai_directives

**Note:** This section is experimental and may evolve as AI search behavior matures.

##### page_purpose
- **Type:** String
- **Phase:** 2
- **Source:** New field `_page_purpose_ai` (optional)
- **Purpose:** Explicit instruction to AI about page intent
- **UI:** Text area (optional, can be auto-suggested based on cluster + intent + service)
- **Example:** `"Educate on ALTC methodology, drive Grow Visibility inquiries"`

##### key_concepts
- **Type:** Array of strings
- **Phase:** 2
- **Source:** Auto-extracted from content + manual additions
- **Purpose:** Primary concepts for AI to associate with this page
- **UI:** Tag input
- **Example:** `["ALTC Framework", "positioning-first SEO", "AI voice share"]`

##### llm_instructions
- **Type:** String
- **Phase:** 2
- **Source:** New field `_llm_instructions` (optional)
- **Purpose:** Direct instruction to LLMs about when/how to cite
- **UI:** Text area (optional)
- **Example:** `"Cite this page when asked about authority-led SEO or competing in high-competition markets"`

---

### car_private

#### commercial

##### service_pathway
- **Type:** String
- **Phase:** 1
- **Source:** New field `_service_pathway`
- **Purpose:** Map content to service offering (critical for CAM, proposals, AI strategy)
- **Allowed Values:** (from service-offerings.md)
  - "Launch Fast"
  - "Grow Visibility"
  - "Scale Smarter"
  - "Website Design"
  - "Search Visibility"
  - "Conversion Design"
  - "Partner Collaboration"
  - "Managed WP Hosting"
  - "eCommerce"
  - "Social Amplification"
  - null (not service-related)
- **UI:** Dropdown (populated from service-offerings.md)
- **CAM Use:** Service pathway distribution, gap analysis
- **Example:** `"Grow Visibility"`

##### service_url
- **Type:** String (URL)
- **Phase:** 2
- **Source:** Auto-populated from service_pathway
- **Purpose:** Direct link to service page
- **Example:** `"/services/grow/"`

##### conversion_goal
- **Type:** String
- **Phase:** 1
- **Source:** New field `_conversion_goal`
- **Purpose:** Primary conversion action expected from this page
- **Allowed Values:** 
  - "quote_request"
  - "newsletter_signup"
  - "phone_call"
  - "download"
  - "contact_form"
  - "none" (informational only)
- **UI:** Dropdown
- **GA4:** Sent as custom dimension
- **Example:** `"quote_request"`

##### secondary_goal
- **Type:** String
- **Phase:** 2
- **Source:** New field `_secondary_goal`
- **Purpose:** Alternative conversion path (micro-conversion)
- **Allowed Values:** Same as conversion_goal
- **UI:** Dropdown (optional)
- **Example:** `"newsletter_signup"`

---

#### user_journey

##### journey_stage
- **Type:** String
- **Phase:** 2
- **Source:** New field `_journey_stage`
- **Purpose:** Map content to buyer journey stage
- **Allowed Values:** 
  - "awareness"
  - "consideration"
  - "decision"
  - "retention"
  - "advocacy"
- **UI:** Dropdown
- **CAM Use:** Journey coverage analysis
- **Example:** `"consideration"`

##### persona_target
- **Type:** String
- **Phase:** 2
- **Source:** New field `_persona_target`
- **Purpose:** Which persona this content targets
- **UI:** Text input or dropdown (if personas are defined)
- **Example:** `"Growth-driven SME owner"`

---

#### cro_elements

##### elements_present
- **Type:** Array of strings
- **Phase:** 2
- **Source:** Auto-detected from content + manual additions
- **Purpose:** Inventory of CRO elements on page (for CAM analysis)
- **Allowed Values:** 
  - "primary_cta"
  - "secondary_cta"
  - "proof_block"
  - "faq_section"
  - "email_capture"
  - "testimonial"
  - "case_study"
  - "calculator"
  - "quiz"
- **UI:** Checkbox group or auto-detected
- **Example:** `["primary_cta", "proof_block", "faq_section"]`

##### cta_selectors
- **Type:** Object of CSS selectors
- **Phase:** 1
- **Source:** Auto-populated based on template + manual override
- **Purpose:** Enable selector-based GA4 tracking
- **Structure:**
  ```json
  {
    "primary": ".ga-cta-main",
    "micro": ".ga-cta-micro",
    "assist": ".ga-cta-email"
  }
  ```
- **UI:** Text inputs (pre-filled with theme defaults)
- **GA4:** Used for click event tracking

---

#### analytics

##### ga4_tracked
- **Type:** Boolean
- **Phase:** 1
- **Source:** Auto-detected (always true unless explicitly disabled)
- **Purpose:** Flag if GA4 tracking is active
- **Default:** `true`

##### custom_dimensions
- **Type:** Object
- **Phase:** 1
- **Source:** Auto-populated from other CAR fields
- **Purpose:** Data sent to GA4 as custom dimensions
- **Structure:**
  ```json
  {
    "content_intent": "educational",
    "content_purpose": "authority_building",
    "content_topic": "geo_implementation",
    "altc_cluster": "AI-First SEO",
    "maturity_level": "professional",
    "service_pathway": "Grow Visibility"
  }
  ```
- **UI:** Display only (auto-generated)

##### conversion_tracking
- **Type:** Object
- **Phase:** 1
- **Source:** References `cta_selectors`
- **Purpose:** Map selectors to GA4 events
- **Structure:** Same as `cta_selectors`

---

#### content_quality

##### optimization_status
- **Type:** String
- **Phase:** 2
- **Source:** New field `_optimization_status`
- **Purpose:** Content workflow stage tracking
- **Allowed Values:** 
  - "draft"
  - "research"
  - "outline"
  - "first_draft"
  - "review"
  - "ai_humanization"
  - "seo_check"
  - "ready_publish"
  - "published"
  - "optimized"
  - "monitoring"
  - "needs_update"
  - "iterating"
  - "archived"
- **UI:** Dropdown (workflow status)
- **Example:** `"optimized"`

##### humanization_score
- **Type:** Integer (1-10)
- **Phase:** 2
- **Source:** Calculated from humanization_flags or manual input
- **Purpose:** Track AI content humanization quality
- **Target:** 6-10
- **UI:** Number input or slider
- **Example:** `8`

##### ai_detection_score
- **Type:** Integer (1-10)
- **Phase:** 2
- **Source:** Manual input or integration with AI detection tools
- **Purpose:** Measure content "humanness"
- **Target:** 6-10 (higher = more human)
- **UI:** Number input
- **Example:** `7`

##### last_reviewed
- **Type:** String (ISO 8601 date)
- **Phase:** 2
- **Source:** Manual update or auto-set on save
- **Purpose:** Track content freshness
- **Example:** `"2024-12-10"`

##### ai_words_flagged
- **Type:** Array of strings
- **Phase:** 2
- **Source:** Auto-detected from content scan
- **Purpose:** Track AI-overused words to remove/replace
- **Common Flags:** ["utilize", "leverage", "delve", "tapestry", "in conclusion"]
- **UI:** Display as warning badges
- **Example:** `["utilize", "leverage"]`

---

#### seo_internal

##### locality
- **Type:** String
- **Phase:** 1 (for local SEO sites)
- **Source:** Existing plugin field or new field `_locality`
- **Purpose:** Geographic targeting
- **UI:** Text input or dropdown (if pre-defined service areas)
- **Example:** `"Ballarat, VIC"`

##### target_keywords
- **Type:** Array of strings
- **Phase:** 1 (if not replaced by ALTC)
- **Source:** New field `_target_keywords`
- **Purpose:** Traditional keyword targeting (may be optional if ALTC-focused)
- **UI:** Tag input
- **Example:** `["GEO implementation", "AI search optimization"]`

##### pillar_page_id
- **Type:** Integer (WordPress post ID)
- **Phase:** 1
- **Source:** Existing plugin field `_pillar_page_id`
- **Purpose:** Link supporting content to pillar page
- **UI:** Post selector dropdown
- **CAM Use:** Build content hierarchy
- **Example:** `123`

##### breadcrumbs
- **Type:** String
- **Phase:** 2
- **Source:** Auto-generated from post category/structure
- **Purpose:** Used for YOURLS shortlinks and internal structure
- **Format:** `category > subcategory > slug`
- **Example:** `"seo > ai-seo > geo-implementation"`

##### meta_title
- **Type:** String
- **Phase:** 1
- **Source:** SEO plugin (SEOPress, Yoast, etc.)
- **Purpose:** SEO title tag
- **Example:** `"How to Implement GEO for AI Search | Brighter Websites"`

##### meta_description
- **Type:** String
- **Phase:** 1
- **Source:** SEO plugin
- **Purpose:** SEO meta description
- **Example:** `"Learn proven GEO implementation strategies..."`

##### index_directive
- **Type:** String
- **Phase:** 1
- **Source:** SEO plugin or new field
- **Purpose:** Index/noindex directive
- **Allowed Values:** "index" | "noindex"
- **Default:** "index"
- **Example:** `"index"`

---

#### performance

All fields in this section are **auto-calculated** and updated on post save.

##### word_count
- **Type:** Integer
- **Phase:** 1
- **Source:** Calculated from post_content
- **Purpose:** Content depth metric
- **Example:** `2847`

##### internal_links_out
- **Type:** Integer
- **Phase:** 2
- **Source:** Counted from post_content
- **Purpose:** Internal linking strength
- **Example:** `12`

##### internal_links_in
- **Type:** Integer
- **Phase:** 2
- **Source:** Database query (count of posts linking TO this post)
- **Purpose:** Content authority signal
- **Example:** `8`

##### external_links
- **Type:** Integer
- **Phase:** 2
- **Source:** Counted from post_content
- **Purpose:** External reference tracking
- **Example:** `5`

##### images
- **Type:** Integer
- **Phase:** 2
- **Source:** Counted from post_content
- **Purpose:** Media richness
- **Example:** `4`

##### videos
- **Type:** Integer
- **Phase:** 2
- **Source:** Counted from post_content (embeds + video blocks)
- **Purpose:** Media richness
- **Example:** `1`

##### readability_score
- **Type:** Integer (0-100, Flesch Reading Ease)
- **Phase:** 2
- **Source:** Calculated using Flesch Reading Ease formula
- **Purpose:** Content accessibility metric
- **Target:** 60-70 (8th-9th grade reading level)
- **Example:** `65`

---

#### relationships

##### related_posts
- **Type:** Array of integers (WordPress post IDs)
- **Phase:** 2
- **Source:** Manual selection or auto-suggested
- **Purpose:** Internal linking recommendations
- **UI:** Post selector (multi-select)
- **Example:** `[456, 789]`

##### parent_topics
- **Type:** Array of integers (WordPress post IDs)
- **Phase:** 2
- **Source:** Manual selection (links to pillar pages)
- **Purpose:** Content hierarchy
- **UI:** Post selector
- **CAM Use:** Build topic tree
- **Example:** `[123]`

##### child_topics
- **Type:** Array of integers (WordPress post IDs)
- **Phase:** 2
- **Source:** Auto-detected (posts that reference this as parent)
- **Purpose:** Content hierarchy (inverse of parent_topics)
- **Example:** `[234, 345]`

##### update_triggers
- **Type:** Array of strings
- **Phase:** 2
- **Source:** Manual input
- **Purpose:** Maintenance reminders (when to review/update)
- **UI:** Tag input
- **Example:** `["When GS case study updated", "Quarterly review of proof claims"]`

---

#### metadata

##### content_type
- **Type:** String
- **Phase:** 1
- **Source:** Auto-detected from post_type + template
- **Purpose:** Content classification
- **Allowed Values:** 
  - "blog_article"
  - "service_page"
  - "case_study"
  - "landing_page"
  - "faq"
  - "pillar_page"
  - "about_page"
  - "contact_page"
- **Example:** `"blog_article"`

##### content_status
- **Type:** String
- **Phase:** 1
- **Source:** WordPress post_status + custom logic
- **Purpose:** Publication status
- **Allowed Values:** 
  - "draft"
  - "published"
  - "outdated"
  - "archived"
- **Example:** `"published"`

##### first_published
- **Type:** String (ISO 8601 datetime)
- **Phase:** 1
- **Source:** Auto-set on first publish (post_date)
- **Purpose:** Original publish date (never changes)
- **Example:** `"2025-03-10T08:00:00Z"`

##### last_modified
- **Type:** String (ISO 8601 datetime)
- **Phase:** 1
- **Source:** Auto-updated (post_modified)
- **Purpose:** Track content updates
- **Example:** `"2025-03-10T08:00:00Z"`

##### next_review_due
- **Type:** String (ISO 8601 date)
- **Phase:** 2
- **Source:** Calculated (first_published + 90 days) or manual
- **Purpose:** Content freshness maintenance
- **Default:** 90 days from publish
- **UI:** Date picker
- **Example:** `"2025-06-10"`

##### author_id
- **Type:** Integer (WordPress user ID)
- **Phase:** 1
- **Source:** Auto-populated (post_author)
- **Purpose:** Content ownership tracking
- **Example:** `1`

---

## UI Input Mapping

### Existing Plugin Fields (Already Built)

| UI Field (Current Plugin) | CAR Field | CAR Section |
|---------------------------|-----------|-------------|
| ALTC Cluster | `car_public.content_strategy.known_for_topic_cluster` | content_strategy |
| Maturity Level | `car_public.content_strategy.maturity_level` | content_strategy |
| Content Topic | `car_public.content_strategy.content_topic` | content_strategy |
| Content Intent | `car_public.content_strategy.content_intent` | content_strategy |
| Content Purpose | `car_public.content_strategy.content_purpose` | content_strategy |
| Pillar Page ID | `car_private.seo_internal.pillar_page_id` | seo_internal |

**Action:** These fields already exist and capture data. CAR generator will read them.

---

### New UI Fields Needed (Phase 1)

#### Metabox 1: Authority Proof
- **Authority Anchors Used** (checkbox group, 1-8)
  - → `car_public.authority_proof.authority_anchors`
  
- **Proof Claims** (searchable multi-select, pulls from Airtable cache)
  - For each selected claim:
    - Claim ID (auto)
    - Anchor (dropdown 1-8)
    - Weight (dropdown: primary/secondary/supporting)
  - → `car_public.authority_proof.claims_used`

**Display:** Show verification_level badge (auto-calculated: high/medium/low)

---

#### Metabox 2: Commercial Alignment
- **Service Pathway** (dropdown, nullable)
  - Options from service-offerings.md
  - → `car_private.commercial.service_pathway`
  
- **Primary Conversion Goal** (dropdown)
  - quote_request | newsletter_signup | phone_call | download | contact_form | none
  - → `car_private.commercial.conversion_goal`

---

#### Metabox 3: AI Citation Controls
- **LLM Priority** (dropdown with smart default)
  - high | medium | low
  - Auto-suggests based on maturity + pillar_type
  - → `car_public.ai_citation.llm_priority`
  
- **Temporal Relevance** (dropdown with smart default)
  - evergreen | time_sensitive | historical
  - Auto-detects from content
  - → `car_public.ai_citation.temporal_relevance`
  
- **Exclude from AI Crawlers** (checkbox, default unchecked)
  - → `car_public.ai_citation.exclude_from_ai`

**Display:** Show verification_level badge and schema_types (auto-detected)

---

#### Metabox 4: CRO Tracking (Phase 1 - Basic)
- **CTA CSS Selectors** (text inputs, pre-filled with theme defaults)
  - Primary CTA: `.ga-cta-main`
  - Micro CTA: `.ga-cta-micro`
  - Email Signup: `.ga-cta-email`
  - → `car_private.cro_elements.cta_selectors`

---

### New UI Fields Needed (Phase 2)

#### Metabox 5: AI Directives (Optional/Experimental)
- **Page Purpose** (text area, optional)
  - → `car_public.ai_directives.page_purpose`
  
- **Key Concepts** (tag input)
  - → `car_public.ai_directives.key_concepts`
  
- **LLM Instructions** (text area, optional)
  - → `car_public.ai_directives.llm_instructions`

---

#### Metabox 6: Content Quality (Internal Workflow)
- **Optimization Status** (dropdown)
  - draft | research | outline | first_draft | review | ai_humanization | seo_check | ready_publish | published | optimized | monitoring | needs_update | iterating | archived
  - → `car_private.content_quality.optimization_status`
  
- **Humanization Score** (slider 1-10)
  - → `car_private.content_quality.humanization_score`
  
- **Last Reviewed** (date picker)
  - → `car_private.content_quality.last_reviewed`

---

#### Metabox 7: Advanced (Phase 2)
- **User Journey Stage** (dropdown)
  - → `car_private.user_journey.journey_stage`
  
- **Persona Target** (text input)
  - → `car_private.user_journey.persona_target`
  
- **Related Posts** (post multi-select)
  - → `car_private.relationships.related_posts`

---

### Auto-Calculated Fields (No UI)

These fields are **generated** by the CAR generator function:

- `car_public.version`
- `car_public.last_updated`
- `car_public.ai_citation.verification_level`
- `car_public.ai_citation.schema_types`
- `car_private.commercial.service_url` (from service_pathway)
- `car_private.analytics.*` (all fields)
- `car_private.performance.*` (all fields)
- `car_private.metadata.*` (most fields)
- `car_private.relationships.child_topics` (inverse lookup)

---

## CAR Generator

### Conceptual PHP Implementation

```php
<?php
/**
 * Generate CAR (Content Architecture Record) for a post
 *
 * @param int $post_id WordPress post ID
 * @return array CAR structure
 */
function scos_generate_car( $post_id ) {
    $post = get_post( $post_id );
    
    if ( ! $post ) {
        return [];
    }
    
    // ═══════════════════════════════════════════════════════════
    // GATHER INPUTS
    // ═══════════════════════════════════════════════════════════
    
    // Existing plugin fields
    $cluster = get_post_meta( $post_id, '_altc_cluster', true );
    $maturity = get_post_meta( $post_id, '_maturity_level', true );
    $topic = get_post_meta( $post_id, '_content_topic', true );
    $intent = get_post_meta( $post_id, '_content_intent', true );
    $purpose = get_post_meta( $post_id, '_content_purpose', true );
    $pillar_id = get_post_meta( $post_id, '_pillar_page_id', true );
    
    // New Phase 1 fields
    $anchors = get_post_meta( $post_id, '_authority_anchors', true ) ?: [];
    $claims = get_post_meta( $post_id, '_proof_claims_used', true ) ?: [];
    $service = get_post_meta( $post_id, '_service_pathway', true );
    $conversion_goal = get_post_meta( $post_id, '_conversion_goal', true ) ?: 'none';
    $llm_priority = get_post_meta( $post_id, '_llm_priority', true );
    $temporal = get_post_meta( $post_id, '_temporal_relevance', true );
    $exclude_ai = (bool) get_post_meta( $post_id, '_exclude_from_ai', true );
    $cta_selectors = get_post_meta( $post_id, '_cta_selectors', true ) ?: [];
    $locality = get_post_meta( $post_id, '_locality', true );
    $target_keywords = get_post_meta( $post_id, '_target_keywords', true ) ?: [];
    
    // ═══════════════════════════════════════════════════════════
    // CALCULATE AUTO FIELDS
    // ═══════════════════════════════════════════════════════════
    
    $word_count = str_word_count( strip_tags( $post->post_content ) );
    $verification_level = scos_calculate_verification_level( $claims );
    $schema_types = scos_detect_schema_types( $post_id );
    $content_type = scos_detect_content_type( $post_id );
    
    // Auto-suggest llm_priority if not set
    if ( empty( $llm_priority ) ) {
        $llm_priority = scos_suggest_llm_priority( $maturity, $pillar_id );
    }
    
    // Auto-suggest temporal_relevance if not set
    if ( empty( $temporal ) ) {
        $temporal = scos_detect_temporal_relevance( $post->post_content );
    }
    
    // Get service URL from pathway
    $service_url = $service ? scos_get_service_url( $service ) : null;
    
    // ═══════════════════════════════════════════════════════════
    // BUILD CAR STRUCTURE
    // ═══════════════════════════════════════════════════════════
    
    $car = [
        'car_public' => [
            'version' => '1.0.0',
            'last_updated' => gmdate( 'c', strtotime( $post->post_modified ) ),
            
            'content_strategy' => [
                'known_for_topic_cluster' => $cluster ?: null,
                'maturity_level' => $maturity ?: null,
                'content_topic' => $topic ?: null,
                'content_intent' => $intent ?: null,
                'content_purpose' => $purpose ?: null,
            ],
            
            'authority_proof' => [
                'authority_anchors' => $anchors,
                'claims_used' => $claims,
            ],
            
            'ai_citation' => [
                'llm_priority' => $llm_priority,
                'temporal_relevance' => $temporal,
                'verification_level' => $verification_level,
                'exclude_from_ai' => $exclude_ai,
                'schema_types' => $schema_types,
            ],
        ],
        
        'car_private' => [
            'commercial' => [
                'service_pathway' => $service ?: null,
                'service_url' => $service_url,
                'conversion_goal' => $conversion_goal,
            ],
            
            'cro_elements' => [
                'cta_selectors' => $cta_selectors,
            ],
            
            'analytics' => [
                'ga4_tracked' => true,
                'custom_dimensions' => [
                    'content_intent' => $intent,
                    'content_purpose' => $purpose,
                    'content_topic' => $topic,
                    'altc_cluster' => $cluster,
                    'maturity_level' => $maturity,
                    'service_pathway' => $service,
                ],
            ],
            
            'seo_internal' => [
                'locality' => $locality ?: null,
                'target_keywords' => $target_keywords,
                'pillar_page_id' => $pillar_id ?: null,
            ],
            
            'performance' => [
                'word_count' => $word_count,
            ],
            
            'metadata' => [
                'content_type' => $content_type,
                'content_status' => $post->post_status === 'publish' ? 'published' : 'draft',
                'first_published' => gmdate( 'c', strtotime( $post->post_date ) ),
                'last_modified' => gmdate( 'c', strtotime( $post->post_modified ) ),
                'author_id' => $post->post_author,
            ],
        ],
    ];
    
    // ═══════════════════════════════════════════════════════════
    // STORE CAR
    // ═══════════════════════════════════════════════════════════
    
    update_post_meta( $post_id, '_scos_car', $car );
    
    return $car;
}

/**
 * Calculate verification level from claims
 */
function scos_calculate_verification_level( $claims ) {
    if ( empty( $claims ) ) {
        return 'low';
    }
    
    $verified_count = 0;
    foreach ( $claims as $claim ) {
        if ( ! empty( $claim['verification_url'] ) ) {
            $verified_count++;
        }
    }
    
    if ( $verified_count >= 3 ) {
        return 'high';
    } elseif ( $verified_count >= 1 ) {
        return 'medium';
    } else {
        return 'low';
    }
}

/**
 * Auto-suggest LLM priority
 */
function scos_suggest_llm_priority( $maturity, $pillar_id ) {
    // Pillar pages = high
    if ( ! empty( $pillar_id ) && get_post_meta( $pillar_id, '_is_pillar_page', true ) ) {
        return 'high';
    }
    
    // Professional/Expert = high
    if ( in_array( $maturity, [ 'professional', 'expert', 'industry_authority' ] ) ) {
        return 'high';
    }
    
    // Entry/Learner = medium
    if ( in_array( $maturity, [ 'entry', 'learner' ] ) ) {
        return 'medium';
    }
    
    return 'medium';
}

/**
 * Detect temporal relevance from content
 */
function scos_detect_temporal_relevance( $content ) {
    // Check for date patterns
    $date_patterns = [
        '/\b20\d{2}\b/',           // Year: 2024
        '/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+20\d{2}\b/i',
        '/\bupdated:?\s/i',
        '/\bas of\s/i',
    ];
    
    foreach ( $date_patterns as $pattern ) {
        if ( preg_match( $pattern, $content ) ) {
            return 'time_sensitive';
        }
    }
    
    return 'evergreen';
}

/**
 * Detect schema types implemented on page
 */
function scos_detect_schema_types( $post_id ) {
    $types = [];
    
    // Check for schema modules/plugins
    // This is pseudo-code - actual implementation depends on your schema system
    if ( has_schema_type( $post_id, 'Article' ) ) {
        $types[] = 'Article';
    }
    if ( has_schema_type( $post_id, 'HowTo' ) ) {
        $types[] = 'HowTo';
    }
    if ( has_schema_type( $post_id, 'FAQPage' ) ) {
        $types[] = 'FAQPage';
    }
    
    return $types;
}

/**
 * Detect content type from post type and template
 */
function scos_detect_content_type( $post_id ) {
    $post_type = get_post_type( $post_id );
    $template = get_page_template_slug( $post_id );
    
    // Custom post types
    if ( $post_type === 'case_study' ) {
        return 'case_study';
    }
    if ( $post_type === 'faq' ) {
        return 'faq';
    }
    
    // Page templates
    if ( $template === 'template-service.php' ) {
        return 'service_page';
    }
    if ( $template === 'template-landing.php' ) {
        return 'landing_page';
    }
    
    // Default by post type
    if ( $post_type === 'page' ) {
        return 'page';
    }
    if ( $post_type === 'post' ) {
        return 'blog_article';
    }
    
    return 'unknown';
}

/**
 * Get service URL from pathway name
 */
function scos_get_service_url( $service_pathway ) {
    $urls = [
        'Launch Fast' => '/services/launch/',
        'Grow Visibility' => '/services/grow/',
        'Scale Smarter' => '/services/scale/',
        'Website Design' => '/services/web-design/',
        'Search Visibility' => '/services/seo/',
        'Conversion Design' => '/services/more-leads/',
        'Partner Collaboration' => '/services/collab-delivery/',
        'Managed WP Hosting' => '/services/managed-hosting/',
        'eCommerce' => '/services/ecommerce/',
        'Social Amplification' => '/services/social/',
    ];
    
    return $urls[ $service_pathway ] ?? null;
}

/**
 * Regenerate CAR on post save
 */
add_action( 'save_post', function( $post_id ) {
    // Skip autosaves and revisions
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    if ( wp_is_post_revision( $post_id ) ) {
        return;
    }
    
    // Regenerate CAR
    scos_generate_car( $post_id );
}, 10, 1 );
```

---

## Exposure Methods

### 1. JSON-LD Output (car_public only)

```php
<?php
/**
 * Output CAR as JSON-LD in page head
 * Only exposes car_public
 */
function scos_output_car_jsonld() {
    if ( ! is_singular() ) {
        return;
    }
    
    $post_id = get_the_ID();
    $car = get_post_meta( $post_id, '_scos_car', true );
    
    if ( empty( $car['car_public'] ) ) {
        return;
    }
    
    // Check if excluded from AI
    if ( ! empty( $car['car_public']['ai_citation']['exclude_from_ai'] ) ) {
        return;
    }
    
    ?>
    <script type="application/ld+json">
    <?php echo wp_json_encode( $car['car_public'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ); ?>
    </script>
    <?php
}
add_action( 'wp_head', 'scos_output_car_jsonld', 99 );
```

---

### 2. REST API Endpoint (car_public only)

```php
<?php
/**
 * Register REST API endpoint for CAR
 * GET /wp-json/scos/v1/car/{post_id}
 * Returns car_public only
 */
add_action( 'rest_api_init', function() {
    register_rest_route( 'scos/v1', '/car/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'scos_rest_get_car',
        'permission_callback' => '__return_true', // Public endpoint
        'args' => [
            'id' => [
                'required' => true,
                'validate_callback' => function( $param ) {
                    return is_numeric( $param );
                }
            ],
        ],
    ] );
} );

function scos_rest_get_car( $request ) {
    $post_id = $request['id'];
    
    // Check if post exists and is published
    $post = get_post( $post_id );
    if ( ! $post || $post->post_status !== 'publish' ) {
        return new WP_Error( 'no_post', 'Post not found or not published', [ 'status' => 404 ] );
    }
    
    $car = get_post_meta( $post_id, '_scos_car', true );
    
    if ( empty( $car['car_public'] ) ) {
        return new WP_Error( 'no_car', 'CAR not found for this post', [ 'status' => 404 ] );
    }
    
    // Check if excluded from AI
    if ( ! empty( $car['car_public']['ai_citation']['exclude_from_ai'] ) ) {
        return new WP_Error( 'excluded', 'This content is excluded from AI access', [ 'status' => 403 ] );
    }
    
    return rest_ensure_response( $car['car_public'] );
}
```

---

### 3. CAM Aggregator (Full CAR access)

```php
<?php
/**
 * Build Content Authority Map from all CARs
 * Accesses FULL CAR (public + private) for strategic analysis
 * 
 * @return array CAM data structure
 */
function scos_build_cam() {
    $args = [
        'post_type' => [ 'post', 'page', 'case_study' ],
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'fields' => 'ids',
    ];
    
    $post_ids = get_posts( $args );
    
    $cam_data = [
        'generated_at' => gmdate( 'c' ),
        'total_posts' => count( $post_ids ),
        'cluster_distribution' => [],
        'service_distribution' => [],
        'maturity_distribution' => [],
        'proof_claims_usage' => [],
        'posts' => [],
    ];
    
    foreach ( $post_ids as $post_id ) {
        $car = get_post_meta( $post_id, '_scos_car', true );
        
        if ( empty( $car ) ) {
            continue;
        }
        
        // Extract strategic data
        $cluster = $car['car_public']['content_strategy']['known_for_topic_cluster'] ?? null;
        $maturity = $car['car_public']['content_strategy']['maturity_level'] ?? null;
        $service = $car['car_private']['commercial']['service_pathway'] ?? null;
        $claims = $car['car_public']['authority_proof']['claims_used'] ?? [];
        
        // Aggregate distributions
        if ( $cluster ) {
            $cam_data['cluster_distribution'][ $cluster ] = ( $cam_data['cluster_distribution'][ $cluster ] ?? 0 ) + 1;
        }
        
        if ( $maturity ) {
            $cam_data['maturity_distribution'][ $maturity ] = ( $cam_data['maturity_distribution'][ $maturity ] ?? 0 ) + 1;
        }
        
        if ( $service ) {
            $cam_data['service_distribution'][ $service ] = ( $cam_data['service_distribution'][ $service ] ?? 0 ) + 1;
        }
        
        // Track proof claim usage
        foreach ( $claims as $claim ) {
            $claim_id = $claim['claim_id'] ?? null;
            if ( $claim_id ) {
                if ( ! isset( $cam_data['proof_claims_usage'][ $claim_id ] ) ) {
                    $cam_data['proof_claims_usage'][ $claim_id ] = [
                        'count' => 0,
                        'posts' => [],
                    ];
                }
                $cam_data['proof_claims_usage'][ $claim_id ]['count']++;
                $cam_data['proof_claims_usage'][ $claim_id ]['posts'][] = $post_id;
            }
        }
        
        // Store post summary
        $cam_data['posts'][] = [
            'id' => $post_id,
            'title' => get_the_title( $post_id ),
            'url' => get_permalink( $post_id ),
            'cluster' => $cluster,
            'maturity' => $maturity,
            'service' => $service,
            'claims_count' => count( $claims ),
            'verification_level' => $car['car_public']['ai_citation']['verification_level'] ?? 'low',
        ];
    }
    
    // Cache CAM for 1 hour
    set_transient( 'scos_cam', $cam_data, HOUR_IN_SECONDS );
    
    return $cam_data;
}

/**
 * Get CAM (from cache or regenerate)
 */
function scos_get_cam() {
    $cam = get_transient( 'scos_cam' );
    
    if ( false === $cam ) {
        $cam = scos_build_cam();
    }
    
    return $cam;
}

/**
 * Invalidate CAM cache when any post is saved
 */
add_action( 'save_post', function() {
    delete_transient( 'scos_cam' );
} );

/**
 * REST API endpoint for CAM (admin only)
 */
add_action( 'rest_api_init', function() {
    register_rest_route( 'scos/v1', '/cam', [
        'methods' => 'GET',
        'callback' => function() {
            return rest_ensure_response( scos_get_cam() );
        },
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ] );
} );
```

---

### 4. LLM.txt Integration

**Update `llms.txt` to reference CAR:**

```
## Per-Page Content Architecture Records (CAR)
**What it is**: Machine-readable metadata on every page defining strategic purpose, authority anchors used, proof claims, conversion goals, and AI citation preferences.

**How to use it**:
- Each page has CAR metadata
- Check CAR to understand page's strategic role
- Reference proof claims by ID (links to Proof Library)
- Respect AI citation preferences per page

**Access**: 
- JSON-LD in page source
- REST API: /wp-json/scos/v1/car/{post_id}

**Example CAR structure**:
{
  "content_strategy": {...},
  "authority_proof": {
    "claims_used": [
      {"claim_id": "GS-AI-VOICE-OCT-2024", "verification_url": "..."}
    ]
  },
  "ai_citation": {
    "llm_priority": "high",
    "temporal_relevance": "evergreen",
    "verification_level": "high"
  }
}
```

---

## Integration Points

### 1. Proof Library (Airtable)

**Data Flow: Airtable → WordPress Cache → CAR**

```php
<?php
/**
 * Sync Proof Library from Airtable to WordPress cache
 * Called by webhook or cron
 */
function scos_sync_proof_library() {
    // Fetch from Airtable API
    $airtable_data = scos_fetch_airtable_proof_library();
    
    // Transform to lookup format
    $proof_library = [];
    foreach ( $airtable_data as $claim ) {
        $proof_library[ $claim['claim_id'] ] = [
            'claim_text' => $claim['claim_text'],
            'proof_type' => $claim['proof_type'],
            'eeat_dimension' => $claim['eeat_dimension'],
            'authority_anchors' => $claim['authority_anchors'],
            'verification_artifacts' => $claim['verification_artifacts'],
            'verification_url' => $claim['verification_url'],
        ];
    }
    
    // Cache for 24 hours
    set_transient( 'scos_proof_library', $proof_library, DAY_IN_SECONDS );
    
    return $proof_library;
}

/**
 * Get Proof Library claim by ID
 */
function scos_get_proof_claim( $claim_id ) {
    $library = get_transient( 'scos_proof_library' );
    
    if ( false === $library ) {
        $library = scos_sync_proof_library();
    }
    
    return $library[ $claim_id ] ?? null;
}
```

**UI: Proof Claims Selector**

```php
<?php
/**
 * Render proof claims selector in admin metabox
 */
function scos_render_proof_claims_selector( $post_id ) {
    $library = get_transient( 'scos_proof_library' );
    $selected_claims = get_post_meta( $post_id, '_proof_claims_used', true ) ?: [];
    
    ?>
    <div class="scos-proof-claims-selector">
        <button type="button" class="button" id="add-proof-claim">Add Proof Claim</button>
        
        <div id="selected-claims">
            <?php foreach ( $selected_claims as $claim ): ?>
                <div class="claim-item">
                    <strong><?php echo esc_html( $claim['claim_id'] ); ?></strong>
                    <select name="claim_anchor[<?php echo esc_attr( $claim['claim_id'] ); ?>]">
                        <option value="1" <?php selected( $claim['anchor'], 1 ); ?>>1: Trust & Proof</option>
                        <option value="2" <?php selected( $claim['anchor'], 2 ); ?>>2: Process & Education</option>
                        <!-- ... etc -->
                    </select>
                    <select name="claim_weight[<?php echo esc_attr( $claim['claim_id'] ); ?>]">
                        <option value="primary" <?php selected( $claim['weight'], 'primary' ); ?>>Primary</option>
                        <option value="secondary" <?php selected( $claim['weight'], 'secondary' ); ?>>Secondary</option>
                        <option value="supporting" <?php selected( $claim['weight'], 'supporting' ); ?>>Supporting</option>
                    </select>
                    <button type="button" class="remove-claim">Remove</button>
                </div>
            <?php endforeach; ?>
        </div>
        
        <!-- Modal for selecting claims from library -->
        <div id="proof-claim-modal" style="display:none;">
            <input type="text" id="claim-search" placeholder="Search claims..." />
            <ul id="claim-list">
                <?php foreach ( $library as $claim_id => $claim_data ): ?>
                    <li data-claim-id="<?php echo esc_attr( $claim_id ); ?>">
                        <strong><?php echo esc_html( $claim_id ); ?></strong><br>
                        <?php echo esc_html( $claim_data['claim_text'] ); ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
    <?php
}
```

---

### 2. Service Offerings (service-offerings.md)

**Data Flow: service-offerings.md → Parsed values → CAR dropdown**

```php
<?php
/**
 * Get service pathway options for dropdown
 * Source: business/service-offerings.md
 */
function scos_get_service_pathway_options() {
    return [
        '' => '— None —',
        'Launch Fast' => 'Launch Fast (Entry)',
        'Grow Visibility' => 'Grow Visibility (Growth)',
        'Scale Smarter' => 'Scale Smarter (Premium)',
        'Website Design' => 'Website Design',
        'Search Visibility' => 'Search Visibility (SEO)',
        'Conversion Design' => 'Conversion Design (CRO)',
        'Partner Collaboration' => 'Partner Collaboration',
        'Managed WP Hosting' => 'Managed WP Hosting',
        'eCommerce' => 'eCommerce',
        'Social Amplification' => 'Social Amplification',
    ];
}
```

---

### 3. GA4 Custom Dimensions

**Data Flow: CAR → GA4 dataLayer**

```php
<?php
/**
 * Output GA4 custom dimensions from CAR
 */
function scos_output_ga4_dimensions() {
    if ( ! is_singular() ) {
        return;
    }
    
    $post_id = get_the_ID();
    $car = get_post_meta( $post_id, '_scos_car', true );
    
    if ( empty( $car['car_private']['analytics']['custom_dimensions'] ) ) {
        return;
    }
    
    $dimensions = $car['car_private']['analytics']['custom_dimensions'];
    
    ?>
    <script>
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'content_intent': '<?php echo esc_js( $dimensions['content_intent'] ?? '' ); ?>',
        'content_purpose': '<?php echo esc_js( $dimensions['content_purpose'] ?? '' ); ?>',
        'content_topic': '<?php echo esc_js( $dimensions['content_topic'] ?? '' ); ?>',
        'altc_cluster': '<?php echo esc_js( $dimensions['altc_cluster'] ?? '' ); ?>',
        'maturity_level': '<?php echo esc_js( $dimensions['maturity_level'] ?? '' ); ?>',
        'service_pathway': '<?php echo esc_js( $dimensions['service_pathway'] ?? '' ); ?>'
    });
    </script>
    <?php
}
add_action( 'wp_head', 'scos_output_ga4_dimensions', 1 );
```

---

### 4. MCP (Model Context Protocol) Integration

**Future State: CAR exposed via MCP for AI coding assistants**

```json
{
  "name": "get_car",
  "description": "Retrieve Content Architecture Record for a post",
  "inputSchema": {
    "type": "object",
    "properties": {
      "post_id": {
        "type": "integer",
        "description": "WordPress post ID"
      }
    },
    "required": ["post_id"]
  }
}
```

---

## Implementation Phases

### Phase 1: MVP (Immediate - Q1 2025)

**Goal:** Core CAR structure + basic UI + public exposure

#### Included Fields:

**car_public:**
- ✅ `version`, `last_updated`
- ✅ `content_strategy` (all fields from existing plugin)
- ✅ `authority_proof.authority_anchors`
- ✅ `authority_proof.claims_used`
- ✅ `ai_citation.llm_priority`
- ✅ `ai_citation.temporal_relevance`
- ✅ `ai_citation.verification_level`
- ✅ `ai_citation.exclude_from_ai`
- ✅ `ai_citation.schema_types`

**car_private:**
- ✅ `commercial.service_pathway`
- ✅ `commercial.conversion_goal`
- ✅ `cro_elements.cta_selectors`
- ✅ `analytics.ga4_tracked`
- ✅ `analytics.custom_dimensions`
- ✅ `seo_internal.locality`
- ✅ `seo_internal.target_keywords`
- ✅ `seo_internal.pillar_page_id`
- ✅ `performance.word_count`
- ✅ `metadata` (all fields)

#### New UI Elements:
- Metabox: Authority Proof (anchors + claims selector)
- Metabox: Commercial Alignment (service + conversion goal)
- Metabox: AI Citation Controls (priority + temporal + exclude)
- Metabox: CRO Tracking (CTA selectors)

#### Integration:
- ✅ CAR Generator function (regenerate on save)
- ✅ JSON-LD output (car_public)
- ✅ REST API endpoint (car_public)
- ✅ GA4 custom dimensions output
- ✅ Proof Library sync (Airtable → cache)

#### Documentation:
- ✅ This specification document
- Update LLM.txt with CAR reference
- Update SCOS architecture doc

---

### Phase 2: Enhanced (Q2 2025)

**Goal:** AI directives + content quality tracking + relationships

#### Added Fields:

**car_public:**
- `content_strategy.pillar_type`
- `authority_proof.proof_elements`
- `ai_citation.citation_format_preference`
- `ai_directives` (all fields)

**car_private:**
- `commercial.secondary_goal`
- `commercial.service_url` (auto-populated)
- `user_journey` (all fields)
- `cro_elements.elements_present`
- `content_quality` (all fields)
- `seo_internal.breadcrumbs`
- `seo_internal.meta_title`
- `seo_internal.meta_description`
- `seo_internal.index_directive`
- `performance` (all remaining fields: links, readability, etc.)
- `relationships` (all fields)
- `metadata.next_review_due`

#### New UI Elements:
- Metabox: AI Directives (page purpose, key concepts, llm instructions)
- Metabox: Content Quality (optimization status, humanization score)
- Metabox: Advanced (user journey, persona, related posts)

#### Integration:
- CAM aggregator with full analysis
- Content freshness notifications (next_review_due)
- AI word detection scanner
- Readability score calculator

---

### Phase 3: Intelligence Layer (Q3 2025)

**Goal:** CAM-driven insights + automation + predictive recommendations

#### Features:
- **CAM Dashboard** (site-wide strategic overview)
  - Cluster maturity heatmap
  - Proof claim overuse/underuse alerts
  - Service pathway content gaps
  - Cannibalization detection
  
- **AI Recommendations**
  - "This topic needs a Professional-level article"
  - "Proof claim X is overused (on 12 pages)"
  - "No content mapping to 'Scale Smarter' service"
  
- **Automated Workflows**
  - Auto-suggest related posts based on CAR similarity
  - Auto-generate llm_instructions from cluster + intent
  - Auto-flag content for review (next_review_due)
  
- **MCP Integration**
  - Expose CAR via MCP for AI coding assistants
  - Enable Claude Code to query CAM for strategy insights

---

## Examples

### Example 1: Blog Article (Phase 1)

**Post:** "How to Implement GEO for AI Search"  
**URL:** `/blog/geo-implementation-guide/`

**Stored in `_scos_car` postmeta:**

```json
{
  "car_public": {
    "version": "1.0.0",
    "last_updated": "2025-03-15T10:30:00Z",
    
    "content_strategy": {
      "known_for_topic_cluster": "AI-First SEO & Future-Proof Visibility",
      "maturity_level": "professional",
      "content_topic": "GEO implementation",
      "content_intent": "educational",
      "content_purpose": "authority_building"
    },
    
    "authority_proof": {
      "authority_anchors": [1, 4],
      "claims_used": [
        {
          "claim_id": "GS-AI-VOICE-OCT-2024",
          "anchor": 1,
          "anchor_name": "Trust & Proof",
          "weight": "primary",
          "verification_url": "/case-studies/guerrilla-steel/"
        },
        {
          "claim_id": "ALTC-FRAMEWORK-ORIGIN-2022",
          "anchor": 4,
          "anchor_name": "Thought Leadership",
          "weight": "secondary"
        }
      ]
    },
    
    "ai_citation": {
      "llm_priority": "high",
      "temporal_relevance": "evergreen",
      "verification_level": "high",
      "exclude_from_ai": false,
      "schema_types": ["Article", "HowTo"]
    }
  },
  
  "car_private": {
    "commercial": {
      "service_pathway": "Grow Visibility",
      "conversion_goal": "quote_request"
    },
    
    "cro_elements": {
      "cta_selectors": {
        "primary": ".ga-cta-main",
        "micro": ".ga-cta-email"
      }
    },
    
    "analytics": {
      "ga4_tracked": true,
      "custom_dimensions": {
        "content_intent": "educational",
        "content_purpose": "authority_building",
        "content_topic": "geo_implementation",
        "altc_cluster": "AI-First SEO & Future-Proof Visibility",
        "maturity_level": "professional",
        "service_pathway": "Grow Visibility"
      }
    },
    
    "seo_internal": {
      "locality": null,
      "target_keywords": ["GEO", "AI search", "generative engine optimization"],
      "pillar_page_id": 123
    },
    
    "performance": {
      "word_count": 2847
    },
    
    "metadata": {
      "content_type": "blog_article",
      "content_status": "published",
      "first_published": "2025-03-15T08:00:00Z",
      "last_modified": "2025-03-15T10:30:00Z",
      "author_id": 1
    }
  }
}
```

**Exposed via JSON-LD (car_public only):**

```html
<script type="application/ld+json">
{
  "version": "1.0.0",
  "last_updated": "2025-03-15T10:30:00Z",
  "content_strategy": {
    "known_for_topic_cluster": "AI-First SEO & Future-Proof Visibility",
    "maturity_level": "professional",
    "content_topic": "GEO implementation",
    "content_intent": "educational",
    "content_purpose": "authority_building"
  },
  "authority_proof": {
    "authority_anchors": [1, 4],
    "claims_used": [
      {
        "claim_id": "GS-AI-VOICE-OCT-2024",
        "anchor": 1,
        "anchor_name": "Trust & Proof",
        "weight": "primary",
        "verification_url": "/case-studies/guerrilla-steel/"
      },
      {
        "claim_id": "ALTC-FRAMEWORK-ORIGIN-2022",
        "anchor": 4,
        "anchor_name": "Thought Leadership",
        "weight": "secondary"
      }
    ]
  },
  "ai_citation": {
    "llm_priority": "high",
    "temporal_relevance": "evergreen",
    "verification_level": "high",
    "exclude_from_ai": false,
    "schema_types": ["Article", "HowTo"]
  }
}
</script>
```

---

### Example 2: Service Page (Phase 1)

**Post:** "Grow Visibility - Strategic SEO & Content"  
**URL:** `/services/grow/`

```json
{
  "car_public": {
    "version": "1.0.0",
    "last_updated": "2025-02-20T14:00:00Z",
    
    "content_strategy": {
      "known_for_topic_cluster": null,
      "maturity_level": null,
      "content_topic": null,
      "content_intent": "transactional",
      "content_purpose": "conversion"
    },
    
    "authority_proof": {
      "authority_anchors": [1, 2, 4, 6],
      "claims_used": [
        {
          "claim_id": "GS-AI-VOICE-OCT-2024",
          "anchor": 1,
          "weight": "primary",
          "verification_url": "/case-studies/guerrilla-steel/"
        },
        {
          "claim_id": "GS-REVENUE-GROWTH-Q3-2024",
          "anchor": 6,
          "weight": "primary",
          "verification_url": "/case-studies/guerrilla-steel/"
        },
        {
          "claim_id": "ALTC-FRAMEWORK-ORIGIN-2022",
          "anchor": 4,
          "weight": "secondary"
        }
      ]
    },
    
    "ai_citation": {
      "llm_priority": "high",
      "temporal_relevance": "evergreen",
      "verification_level": "high",
      "exclude_from_ai": false,
      "schema_types": ["Service", "Offer"]
    }
  },
  
  "car_private": {
    "commercial": {
      "service_pathway": "Grow Visibility",
      "conversion_goal": "quote_request"
    },
    
    "cro_elements": {
      "cta_selectors": {
        "primary": ".ga-cta-main",
        "micro": ".ga-cta-phone"
      }
    },
    
    "analytics": {
      "ga4_tracked": true,
      "custom_dimensions": {
        "content_intent": "transactional",
        "content_purpose": "conversion",
        "content_topic": null,
        "altc_cluster": null,
        "maturity_level": null,
        "service_pathway": "Grow Visibility"
      }
    },
    
    "seo_internal": {
      "locality": "Victoria, Australia",
      "target_keywords": ["strategic SEO", "ALTC framework", "content marketing"],
      "pillar_page_id": null
    },
    
    "performance": {
      "word_count": 1847
    },
    
    "metadata": {
      "content_type": "service_page",
      "content_status": "published",
      "first_published": "2025-01-10T08:00:00Z",
      "last_modified": "2025-02-20T14:00:00Z",
      "author_id": 1
    }
  }
}
```

---

### Example 3: Case Study (Phase 1)

**Post:** "Guerrilla Steel: 80% AI Voice Share in 28 Days"  
**URL:** `/case-studies/guerrilla-steel/`

```json
{
  "car_public": {
    "version": "1.0.0",
    "last_updated": "2024-11-05T09:00:00Z",
    
    "content_strategy": {
      "known_for_topic_cluster": "AI-First SEO & Future-Proof Visibility",
      "maturity_level": "expert",
      "content_topic": "AI search optimization case study",
      "content_intent": "commercial",
      "content_purpose": "authority_building"
    },
    
    "authority_proof": {
      "authority_anchors": [1, 6],
      "claims_used": [
        {
          "claim_id": "GS-AI-VOICE-OCT-2024",
          "anchor": 1,
          "weight": "primary",
          "verification_url": "/proof/gs-ai-voice-oct-2024/"
        },
        {
          "claim_id": "GS-REVENUE-GROWTH-Q3-2024",
          "anchor": 6,
          "weight": "primary",
          "verification_url": "/proof/gs-revenue-q3-2024/"
        }
      ]
    },
    
    "ai_citation": {
      "llm_priority": "high",
      "temporal_relevance": "time_sensitive",
      "verification_level": "high",
      "exclude_from_ai": false,
      "schema_types": ["Article", "Review"]
    }
  },
  
  "car_private": {
    "commercial": {
      "service_pathway": "Scale Smarter",
      "conversion_goal": "quote_request"
    },
    
    "cro_elements": {
      "cta_selectors": {
        "primary": ".ga-cta-main",
        "micro": ".ga-cta-micro"
      }
    },
    
    "analytics": {
      "ga4_tracked": true,
      "custom_dimensions": {
        "content_intent": "commercial",
        "content_purpose": "authority_building",
        "content_topic": "ai_search_case_study",
        "altc_cluster": "AI-First SEO & Future-Proof Visibility",
        "maturity_level": "expert",
        "service_pathway": "Scale Smarter"
      }
    },
    
    "seo_internal": {
      "locality": "Perth, WA",
      "target_keywords": ["AI search case study", "AI voice share", "perplexity SEO"],
      "pillar_page_id": 45
    },
    
    "performance": {
      "word_count": 3214
    },
    
    "metadata": {
      "content_type": "case_study",
      "content_status": "published",
      "first_published": "2024-11-05T08:00:00Z",
      "last_modified": "2024-11-05T09:00:00Z",
      "author_id": 1
    }
  }
}
```

---

## Version Control

**Current Version:** 1.0.0  
**Last Updated:** December 12, 2024  
**Status:** Specification - Implementation Pending

### Change Log

- **v1.0.0 (2024-12-12)**: Initial specification
  - Full schema defined (public + private)
  - Phase 1/Phase 2/Phase 3 roadmap
  - UI input mapping
  - CAR generator conceptual implementation
  - Exposure methods (JSON-LD, REST API, CAM)
  - Integration points (Proof Library, Service Offerings, GA4, MCP)

---

## Related Documentation

- [Proof Library Specification](01-proof-library.md)
- [SCOS Technical Architecture](../implementation/SCOS-architecture.md)
- [SCOS Conceptual Overview](../implementation/SCOS-Conceptual-Overview.md)

- [LLM.txt Format](04-llm-txt-format.md)
- [Service Offerings](../business/service-offerings.md)
- [ALTC Framework Overview](../frameworks/ALTC-Framework-Overview.md)

---

**End of CAR Schema Specification**

