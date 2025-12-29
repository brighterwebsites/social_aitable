# Proof Library Specification

**Version:** 1.0.0  
**Status:** Approved for implementation  
**Last Updated:** December 8, 2025  
**Part of:** CAOS (Content Architecture OS)

---

## Table of Contents

1. [Purpose & Scope](#purpose--scope)
2. [System Context](#system-context)
3. [Core Concept](#core-concept)
4. [Storage Strategy](#storage-strategy)
5. [Data Schema](#data-schema)
6. [Implementation: Google Sheets MVP](#implementation-google-sheets-mvp)
7. [Sync Architecture](#sync-architecture)
8. [WordPress Integration](#wordpress-integration)
9. [Strategic Usage](#strategic-usage)
10. [Future Migration Path](#future-migration-path)

---

## Purpose & Scope

### What Is the Proof Library?

The Proof Library is a **centralized repository of atomic, verifiable claims** that serves as the source of truth for all proof elements used across channels (website, social media, email, presentations, etc.).

### Why It Exists

**Problem Solved:**
- Proof elements scattered across content without tracking
- No single source of truth for claims
- Difficult to assess proof utilization strategically
- Can't answer: "Where have I used this claim?" or "Am I underutilizing strong proof?"
- Claims become outdated without temporal validation

**Solution Provided:**
- ✅ Centralized proof asset management
- ✅ Atomic claims with temporal tracking
- ✅ Cross-channel usage visibility
- ✅ Strategic proof utilization insights
- ✅ Citation traceability for AI platforms
- ✅ Decouples proof from presentation (claim exists independently of where it's cited)

### When It's Created

**Critical Timing:** Proof Library is built **BEFORE the website** during the audit and strategy phase.

**Workflow:**
1. **Audit Phase** → Gather existing proof elements
2. **Strategy Phase** → Define ALTC clusters using proof as validation
3. **Build Phase** → Website pulls from established Proof Library
4. **Growth Phase** → Continuously add claims as results accumulate

---

## System Context

### Where Proof Library Sits in CAOS

```
CAOS (Content Architecture Operating System)
│
├── Proof Library ◄── YOU ARE HERE
│   └── (Airtable/Google Sheets → Future Docker App)
│
├── WordPress Plugin (Site Essentials / UnnamedItem1)
│   ├── Caches Proof Library JSON locally
│   ├── CAR references claims by ID
│   └── Sends usage webhooks back to library
│
├── External Channels
│   ├── Social Media (queries Proof Library)
│   ├── Email Marketing (queries Proof Library)
│   └── Presentations (queries Proof Library)
│
├── MCP Layer (Future)
│   └── AI agents query Proof Library
│
└── CAM (Content Authority Map)
    └── Aggregates proof usage patterns
```

### Relationship to Other Components

| Component | Relationship to Proof Library |
|-----------|------------------------------|
| **CAR** | References claims by `claim_id` |
| **CAM** | Aggregates proof usage patterns site-wide |
| **ALTC Framework** | Uses proof to validate authority positioning |
| **Authority Anchors** | Claims tagged with which anchors they support |
| **Page Directives** | Exposes claim data to AI platforms |
| **LLM.txt** | Declares proof authority at site level |

---

## Core Concept

### The Atomic Claim Principle

**An atomic claim is:**
- ✅ A single, verifiable statement of fact
- ✅ Time-bound (when it became true)
- ✅ Evidence-backed (verification artifact)
- ✅ Independently useful (not context-dependent)

**Examples:**

**✅ Good Atomic Claim:**
```
"Achieved 80% AI voice share in 28 days for Guerrilla Steel"
```
- Single fact
- Time-bound (28 days, October 2024)
- Verifiable (GSC screenshot)
- Useful across contexts

**❌ Bad Atomic Claim:**
```
"We're really good at SEO and have helped lots of clients"
```
- Vague
- Not time-bound
- Not verifiable
- Not independently useful

### Decoupling Proof from Presentation

**Traditional approach:** Proof lives in content
- Problem: Claim updated on Page A, but Page B still has old data
- Problem: Can't track where claim is used
- Problem: Deleting page loses proof record

**Proof Library approach:** Proof exists independently
- ✅ Update claim once, reflects everywhere it's used
- ✅ Track all usage locations
- ✅ Claim persists even if specific content deleted
- ✅ Historical record of proof over time

---

## Storage Strategy

### Why External Storage (Not WordPress Database)

**Decision:** Store in Airtable/Google Sheets initially, migrate to Docker app later

**Rationale:**

| Factor | WordPress Table | External Storage |
|--------|----------------|------------------|
| **Timing** | ❌ Website doesn't exist yet during audit | ✅ Created before website build |
| **Cross-channel** | ❌ Each channel needs WP API access | ✅ All channels query one source |
| **Client ownership** | ⚠️ Tied to website hosting | ✅ Transferable asset (YOURLS model) |
| **Performance** | ⚠️ Additional WP queries | ✅ Cached locally, no frontend queries |
| **Strategic view** | ⚠️ Requires custom WP admin UI | ✅ Native spreadsheet/database UI |
| **Portability** | ❌ Locked to WordPress | ✅ Platform-agnostic |
| **Complexity** | ✅ Simpler (no external sync) | ⚠️ Webhook/sync required |

**Conclusion:** External storage advantages outweigh sync complexity.

### Storage Evolution Path

**Phase 1: Google Sheets** (MVP - Now)
- Free, accessible, familiar
- Easy formula-based insights
- Good for 1-3 businesses

**Phase 2: Airtable** (Growth)
- Better relational structure
- API for automation
- Good for 5-10 businesses

**Phase 3: Docker App** (Scale)
- Custom database (PostgreSQL)
- Advanced querying
- Multi-tenant architecture
- API-first design
- Good for agency use (20+ businesses)

---

## Data Schema

### Complete Field Definitions

```json
{
  // ═══════════════════════════════════════════════════════════
  // CORE IDENTIFICATION
  // ═══════════════════════════════════════════════════════════
  
  "claim_id": "GS-AI-VOICE-SHARE-OCT-2024",
  // Unique identifier (UPPERCASE-KEBAB-CASE)
  // Format: {CLIENT}-{TOPIC}-{DATE}
  // Used to reference claim in CAR
  
  "claim_text": "Achieved 80% AI voice share in 28 days for Guerrilla Steel",
  // Human-readable statement of fact
  // Should be citeable as-is in content
  // 50-150 characters ideal
  
  "claim_status": "active",
  // active | historical | retired | validation_due
  // active: Current, verified, use freely
  // historical: True but dated (e.g., "2022 revenue")
  // retired: No longer relevant
  // validation_due: Needs review
  
  // ═══════════════════════════════════════════════════════════
  // E-E-A-T MAPPING
  // ═══════════════════════════════════════════════════════════
  
  "proof_weight": {
    "eeat_dimension": "authoritativeness",
    // experience | expertise | authoritativeness | trustworthiness
    // Maps to Google's E-E-A-T framework
    // Tells LLMs which dimension this claim proves
    
    "strength": "high"
    // high | medium | low
    // How strong is the proof?
  },
  
  "proof_type": "case_study",
  // case_study | testimonial | data | certification | methodology |
  // award | publication | media_mention | partnership | metric | ugc
  // Categorizes the type of proof
  // ugc = User-Generated Content (reviews, social mentions, unsolicited testimonials)
  
  // ═══════════════════════════════════════════════════════════
  // AUTHORITY ANCHORS
  // ═══════════════════════════════════════════════════════════
  
  "authority_anchors": [1, 4, 6],
  // Simple array: which anchors does this claim support?
  // 1: Trust & Proof
  // 2: Process & Education
  // 3: Comparisons & Decision Support
  // 4: Thought Leadership
  // 5: Local & Community Authority
  // 6: Results-in-Advance
  // (Anchors 7 & 8 are foundational, not content-based)
  //
  // NOTE: Primary/secondary designation happens in CAR,
  // not in Proof Library. A claim can be primary on Page A
  // but secondary on Page B.
  
  // ═══════════════════════════════════════════════════════════
  // TEMPORAL DATA
  // ═══════════════════════════════════════════════════════════
  
  "original_date_achieved": "2024-10-15",
  // ISO 8601 date: When did this become true?
  // Historical footprint for "trust built over time"
  
  "relevance_review_date": "2025-12-08",
  // ISO 8601 date: When was this last verified as still relevant?
  // Signals current validation, not just age
  // If current_date - review_date > 90 days, status → validation_due
  
  // ═══════════════════════════════════════════════════════════
  // CONTEXT (LLM-Friendly)
  // ═══════════════════════════════════════════════════════════
  
  "context": {
    "problem_statement": "Low visibility, 1-2 jobs/month",
    // Optional: What problem did this solve?
    
    "approach_used": "ALTC Framework Implementation",
    // Optional: What method created this result?
    
    "outcome_summary": "80% AI voice share, 28 bookings in October 2024",
    // Required: What was the result?
    
    "client_id": "guerrilla-steel",
    // Links to client/case study
    
    "altc_cluster": "AI-First SEO",
    // Which ALTC cluster does this validate?
    
    "service_pathway": "Grow Visibility"
    // Which service tier does this support?
  },
  
  // ═══════════════════════════════════════════════════════════
  // CITATION TRACEABILITY
  // ═══════════════════════════════════════════════════════════
  
  "canonical_source_url": "/case-studies/guerrilla-steel/#ai-voice-share",
  // The authoritative page where this claim is fully explained
  // with context, methodology, and proof artifact
  // AI platforms should cite this URL
  
  "verification_artifact": {
    "type": "screenshot",
    // screenshot | document | video | data_export | third_party_tool
    
    "url": "/wp-content/uploads/proof/gs-ai-voice-oct-2024.png",
    // Permanent URL to proof artifact
    // Stored in website uploads or external service
    
    "format": "png",
    // png | pdf | mp4 | csv | json | web
    
    "access": "public",
    // public | authenticated | internal_only
    
    "description": "Google Search Console data showing 80% AI voice share"
    // Human-readable description of what the artifact shows
  },
  
  // ═══════════════════════════════════════════════════════════
  // USAGE TRACKING
  // ═══════════════════════════════════════════════════════════
  
  "used_on_pages": [
    {
      "url": "https://brighterwebsites.com.au/altc-framework/",
      "site": "brighterwebsites.com.au",
      "type": "blog_article",
      // blog_article | service_page | case_study | landing_page
      
      "anchor_used_for": 1,
      // Which Authority Anchor was this used for on THIS page?
      
      "weight_on_page": "primary",
      // primary | secondary | supporting
      // This is where primary/secondary matters (usage, not library)
      
      "date_added": "2024-12-01"
      // When was this claim first used on this page?
    }
  ],
  // Updated via webhook when content published/updated
  // Enables strategic insights: "Used 15 times but only in blog articles"
  
  "channel_usage": {
    "website": 2,
    "social": 5,
    "email": 1,
    "presentations": 0
  },
  // Quick summary for strategic decisions
  // "This is strong proof but I'm underutilizing it in email"
  
  // ═══════════════════════════════════════════════════════════
  // PROGRESSION DATA (Optional)
  // ═══════════════════════════════════════════════════════════
  
  "progression_data": {
    "metric_name": "AI voice share",
    "metric_unit": "percentage",
    
    "data_points": [
      {"date": "2024-08-01", "value": 23},
      {"date": "2024-09-01", "value": 45},
      {"date": "2024-10-01", "value": 80}
    ],
    // Time-series data showing improvement
    
    "trend": "increasing",
    // increasing | decreasing | stable
    
    "trend_strength": "strong",
    // strong | moderate | weak
    
    "data_source": "Google Search Console"
    // Where did this data come from?
  },
  // Highest form of Experience proof: shows repeatable process
  // LLMs value this for "how they achieved it" context
  
  // ═══════════════════════════════════════════════════════════
  // METADATA (Automatic)
  // ═══════════════════════════════════════════════════════════
  
  "created_at": "2024-12-04T10:30:00Z",
  "updated_at": "2025-12-08T15:45:00Z",
  "created_by": "vanessa",
  "business_id": "brighter-websites"
  // Which business does this proof belong to?
  // Enables multi-tenant Docker app in future
}
```

---

## Implementation: Google Sheets MVP

### Sheet Structure

**File:** `Proof Library - {Business Name}`  
**Sheets:** 4 sheets per business

#### Sheet 1: Claims (Main)

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| claim_id | Text | GS-AI-VOICE-OCT-2024 | Primary key |
| claim_text | Text | 80% AI voice share in 28 days | Human-readable |
| claim_status | Dropdown | active | active/historical/retired/validation_due |
| proof_type | Dropdown | case_study | See proof types list |
| eeat_dimension | Dropdown | authoritativeness | experience/expertise/authoritativeness/trustworthiness |
| eeat_strength | Dropdown | high | high/medium/low |
| authority_anchors | Text | 1,4,6 | Comma-separated numbers |
| original_date | Date | 2024-10-15 | When achieved |
| review_date | Date | 2025-12-08 | Last verified |
| problem_statement | Text | Low visibility... | Optional |
| approach_used | Text | ALTC Framework | Optional |
| outcome_summary | Text | 80% voice share... | Required |
| client_id | Text | guerrilla-steel | Links to client |
| altc_cluster | Dropdown | AI-First SEO | Which cluster |
| service_pathway | Dropdown | Grow Visibility | Which service |
| canonical_url | URL | /case-studies/... | Where claim fully explained |
| created_at | Timestamp | 2024-12-04 10:30 | Auto |
| updated_at | Timestamp | 2025-12-08 15:45 | Auto |

#### Sheet 2: Verification Artifacts

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| claim_id | Text | GS-AI-VOICE-OCT-2024 | Foreign key |
| artifact_type | Dropdown | screenshot | screenshot/document/video/data_export |
| artifact_url | URL | /uploads/proof/... | Permanent URL |
| format | Dropdown | png | File format |
| access | Dropdown | public | public/authenticated/internal |
| description | Text | GSC data showing... | What it proves |

#### Sheet 3: Usage Tracking

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| claim_id | Text | GS-AI-VOICE-OCT-2024 | Foreign key |
| url | URL | https://... | Where used |
| site | Text | brighterwebsites.com.au | Which site |
| type | Dropdown | blog_article | Content type |
| anchor_used_for | Number | 1 | Which anchor |
| weight_on_page | Dropdown | primary | primary/secondary/supporting |
| date_added | Date | 2024-12-01 | When first used |

**Updated via webhook from WordPress**

#### Sheet 4: Progression Data

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| claim_id | Text | GS-AI-VOICE-OCT-2024 | Foreign key |
| metric_name | Text | AI voice share | What's measured |
| metric_unit | Text | percentage | Unit |
| date | Date | 2024-08-01 | Data point date |
| value | Number | 23 | Measurement |
| data_source | Text | Google Search Console | Where from |

### Formulas & Automation

**Sheet 1 (Claims) - Calculated columns:**

```
Column: days_since_review
Formula: =TODAY() - [review_date]

Column: validation_warning
Formula: =IF([days_since_review] > 90, "⚠️ Review needed", "✓")

Column: total_usage
Formula: =COUNTIF('Usage Tracking'!A:A, [claim_id])

Column: website_usage
Formula: =COUNTIFS('Usage Tracking'!A:A, [claim_id], 'Usage Tracking'!D:D, "website")
```

**Conditional formatting:**
- Red: `claim_status = "validation_due"`
- Yellow: `days_since_review > 90`
- Green: `claim_status = "active"` AND `days_since_review < 90`

---

## Sync Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────┐
│  Proof Library (Google Sheets / Airtable)          │
│  - Claims stored here                               │
│  - Source of truth                                  │
└────────────┬────────────────────────────────────────┘
             │
             │ (1) Manual sync or scheduled webhook
             │     Sends full JSON export
             ↓
┌─────────────────────────────────────────────────────┐
│  WordPress REST API                                 │
│  POST /wp-json/caos/v1/proof-library/sync          │
│  - Receives JSON array of all claims                │
│  - Validates structure                              │
│  - Stores in wp_options: caos_proof_library_cache   │
└────────────┬────────────────────────────────────────┘
             │
             │ (2) CAR editor loads from cache
             │     No external API calls
             ↓
┌─────────────────────────────────────────────────────┐
│  CAR Meta Box (Post Editor)                        │
│  - Shows available claims                           │
│  - User selects claim IDs for content               │
│  - Saves to _scos_car post meta                     │
└────────────┬────────────────────────────────────────┘
             │
             │ (3) On post save, if CAR has claims
             │     Send usage webhook
             ↓
┌─────────────────────────────────────────────────────┐
│  Webhook: Update Usage Tracking                     │
│  - POST to Zapier/Make.com                          │
│  - Adds row to "Usage Tracking" sheet               │
│  - Updates channel_usage counts                     │
└─────────────────────────────────────────────────────┘
```

### Sync Endpoints

#### 1. WordPress Receives Full Library

**Endpoint:** `POST /wp-json/caos/v1/proof-library/sync`

**Request Body:**
```json
{
  "claims": [
    { /* full claim object */ },
    { /* full claim object */ }
  ],
  "sync_timestamp": "2025-12-08T16:00:00Z",
  "business_id": "brighter-websites"
}
```

**Response:**
```json
{
  "success": true,
  "claims_synced": 47,
  "cache_updated": "2025-12-08T16:00:05Z"
}
```

**WordPress stores in:**
```php
update_option('caos_proof_library_cache', [
    'claims' => $claims,
    'last_sync' => current_time('mysql'),
    'business_id' => $business_id
]);
```

#### 2. WordPress Reports Usage

**Endpoint:** Webhook URL (Zapier/Make.com)

**Sent when:** Post saved with CAR containing claim IDs

**Payload:**
```json
{
  "event": "claim_used",
  "claim_id": "GS-AI-VOICE-OCT-2024",
  "url": "https://brighterwebsites.com.au/altc-framework/",
  "site": "brighterwebsites.com.au",
  "type": "blog_article",
  "anchor_used_for": 1,
  "weight_on_page": "primary",
  "date_added": "2025-12-08"
}
```

**Zapier/Make.com flow:**
1. Receives webhook
2. Adds row to "Usage Tracking" sheet
3. Updates "channel_usage" counts in Claims sheet

### Sync Frequency

**Option A: Manual** (MVP)
- Admin clicks "Sync Proof Library" in WordPress
- Fetches from Google Sheets API or reads pasted JSON
- Good for: Testing, low-frequency updates

**Option B: Scheduled** (Production)
- Zapier/Make.com runs daily
- Exports Google Sheets as JSON
- POSTs to WordPress endpoint
- Good for: Set-and-forget automation

**Option C: Real-time** (Future Docker App)
- Webhook on every Proof Library edit
- Immediate sync to all sites
- Good for: Agency with many sites

---

## WordPress Integration

### Plugin Implementation

**Module:** Content Strategy Module (part of Site Essentials plugin)

#### 1. Cache Management

```php
namespace CAOS\Modules\ContentStrategy;

class Proof_Library_Cache {
    
    /**
     * Get all cached claims
     */
    public static function get_claims() {
        $cache = get_option('caos_proof_library_cache', []);
        return $cache['claims'] ?? [];
    }
    
    /**
     * Get single claim by ID
     */
    public static function get_claim($claim_id) {
        $claims = self::get_claims();
        foreach ($claims as $claim) {
            if ($claim['claim_id'] === $claim_id) {
                return $claim;
            }
        }
        return null;
    }
    
    /**
     * Get claims by authority anchor
     */
    public static function get_claims_by_anchor($anchor_id) {
        $claims = self::get_claims();
        return array_filter($claims, function($claim) use ($anchor_id) {
            return in_array($anchor_id, $claim['authority_anchors']);
        });
    }
    
    /**
     * Sync from external source
     */
    public static function sync($claims_data) {
        update_option('caos_proof_library_cache', [
            'claims' => $claims_data['claims'],
            'last_sync' => current_time('mysql'),
            'business_id' => $claims_data['business_id']
        ]);
        
        return count($claims_data['claims']);
    }
}
```

#### 2. REST API Endpoint

```php
register_rest_route('caos/v1', '/proof-library/sync', [
    'methods' => 'POST',
    'callback' => 'caos_sync_proof_library',
    'permission_callback' => function() {
        return current_user_can('manage_options');
    }
]);

function caos_sync_proof_library($request) {
    $data = $request->get_json_params();
    
    // Validate structure
    if (!isset($data['claims']) || !is_array($data['claims'])) {
        return new WP_Error('invalid_data', 'Claims array required', ['status' => 400]);
    }
    
    // Sync to cache
    $count = Proof_Library_Cache::sync($data);
    
    return [
        'success' => true,
        'claims_synced' => $count,
        'cache_updated' => current_time('mysql')
    ];
}
```

#### 3. CAR Meta Box Integration

```php
// In CAR meta box, show available claims
add_meta_box('caos_car_proof', 'Proof Library', 'caos_render_proof_selector', 'post', 'normal');

function caos_render_proof_selector($post) {
    $claims = Proof_Library_Cache::get_claims();
    $selected_claims = get_post_meta($post->ID, '_caos_car_claims', true) ?: [];
    
    ?>
    <div class="proof-library-selector">
        <h4>Available Claims</h4>
        <?php foreach ($claims as $claim): ?>
            <label>
                <input type="checkbox" 
                       name="car_claims[]" 
                       value="<?php echo esc_attr($claim['claim_id']); ?>"
                       <?php checked(in_array($claim['claim_id'], $selected_claims)); ?>>
                <?php echo esc_html($claim['claim_text']); ?>
                <span class="claim-meta">
                    Anchors: <?php echo implode(', ', $claim['authority_anchors']); ?> |
                    E-E-A-T: <?php echo $claim['proof_weight']['eeat_dimension']; ?>
                </span>
            </label>
        <?php endforeach; ?>
    </div>
    <?php
}
```

#### 4. Usage Webhook

```php
add_action('save_post', 'caos_report_claim_usage', 10, 2);

function caos_report_claim_usage($post_id, $post) {
    // Don't fire on autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    
    // Get CAR data
    $car = get_post_meta($post_id, '_scos_car', true);
    if (!$car || !isset($car['authority_proof']['claims_used'])) return;
    
    // Get webhook URL from settings
    $webhook_url = get_option('caos_proof_library_webhook_url');
    if (!$webhook_url) return;
    
    // Send usage data for each claim
    foreach ($car['authority_proof']['claims_used'] as $claim_usage) {
        wp_remote_post($webhook_url, [
            'body' => json_encode([
                'event' => 'claim_used',
                'claim_id' => $claim_usage['claim_id'],
                'url' => get_permalink($post_id),
                'site' => get_site_url(),
                'type' => get_post_type($post_id),
                'anchor_used_for' => $claim_usage['anchor'],
                'weight_on_page' => $claim_usage['weight'],
                'date_added' => current_time('Y-m-d')
            ]),
            'headers' => ['Content-Type' => 'application/json']
        ]);
    }
}
```

---

## Strategic Usage

### How to Use Proof Library in Practice

#### During Audit Phase (Before Website)

**Step 1: Gather existing proof**
- Client testimonials → Create claims
- Case study results → Create claims
- Certifications/awards → Create claims
- Historical data → Create claims with progression

**Step 2: Validate ALTC clusters**
- Do we have proof for "AI-First SEO" positioning? ✓
- Do we have proof for "Conversion-Focused Design"? ✗ (gap identified)
- Proof Library reveals which clusters are viable vs aspirational

**Step 3: Map to Authority Anchors**
- Trust & Proof (Anchor 1): 15 claims ✓
- Thought Leadership (Anchor 4): 2 claims ⚠️ (need more)
- Local Authority (Anchor 5): 0 claims ❌ (critical gap)

#### During Content Creation

**Step 1: Choose ALTC cluster and topic**
- Writing about "AI-First SEO" in ALTC Cluster 1

**Step 2: Determine required Authority Anchors**
- Need: Trust & Proof (1), Thought Leadership (4), Results-in-Advance (6)

**Step 3: Query Proof Library**
```
Filter: authority_anchors contains [1]
Filter: altc_cluster = "AI-First SEO"
Filter: claim_status = "active"
Sort: proof_weight.strength DESC
```

**Step 4: Select claims for article**
- Primary proof: GS-AI-VOICE-SHARE-OCT-2024 (Anchor 1)
- Secondary proof: NEIL-PATEL-VALIDATION-2024 (Anchor 4)
- Supporting proof: ALTC-FRAMEWORK-ORIGIN-2022 (Anchor 4)

**Step 5: Reference in CAR**
```json
"authority_proof": {
  "claims_used": [
    {
      "claim_id": "GS-AI-VOICE-SHARE-OCT-2024",
      "anchor": 1,
      "weight": "primary"
    }
  ]
}
```

#### Strategic Review (Quarterly)

**Question 1: Am I underutilizing strong proof?**
```
Find: claims with eeat_strength = "high" AND channel_usage.website < 5
Result: "I have 3 high-strength claims barely used - opportunity!"
```

**Question 2: Which ALTC clusters lack proof?**
```
Group by: context.altc_cluster
Count: claims per cluster
Result: "ALTC 3 has only 2 claims, need more conversion proof"
```

**Question 3: Is my proof getting stale?**
```
Find: claims with days_since_review > 180
Result: "5 claims need validation review this quarter"
```

**Question 4: Where am I citing proof?**
```
Group by: used_on_pages.type
Result: "I cite proof in blog articles (80%) but rarely on service pages (20%)"
```

---

## Future Migration Path

### Phase 2: Airtable

**When:** Managing 5-10 businesses, Google Sheets getting unwieldy

**Benefits:**
- Relational structure (linked records)
- Native API for automation
- Better views and filters
- Collaborative features

**Migration:**
- Export Google Sheets as CSV
- Import to Airtable
- Update webhook URLs
- No WordPress changes needed (same JSON structure)

### Phase 3: Docker App (Custom System)

**When:** Agency scale (20+ businesses), need advanced features

**Architecture:**
```
Docker Container
├── PostgreSQL Database
│   ├── claims table
│   ├── verification_artifacts table
│   ├── usage_tracking table
│   └── progression_data table
├── Node.js API
│   ├── REST endpoints
│   ├── GraphQL layer
│   └── WebSocket support (real-time sync)
├── Admin UI (React)
│   ├── Claims management
│   ├── Usage dashboard
│   └── Strategic insights
└── MCP Server (Future)
    └── AI agent tools
```

**Benefits:**
- Multi-tenant (multiple businesses, isolated data)
- Advanced querying (GraphQL)
- Real-time sync (WebSockets)
- Analytics dashboard (usage insights)
- MCP integration (AI agents query directly)
- Export/import (portable data)

**Migration:**
- Export from Airtable via API
- Bulk import to PostgreSQL
- Update WordPress endpoint URLs
- Maintain same JSON structure (backward compatible)

---

## Success Criteria

**Proof Library is successful when:**

✅ **Audit Phase**
- Can identify proof gaps before website build
- Validates ALTC cluster viability with evidence

✅ **Content Creation**
- Writers can query available proof by anchor/cluster
- No guessing "what proof do we have for this?"
- Claims cited consistently across channels

✅ **Strategic Decision-Making**
- Can answer "where have I used this claim?" instantly
- Identifies underutilized strong proof
- Reveals gaps (clusters without proof)

✅ **Temporal Accuracy**
- Claims validated regularly (review_date tracked)
- Outdated claims flagged automatically
- Historical claims preserved but marked

✅ **Cross-Channel**
- Same claim used on website, social, email
- Single source of truth prevents inconsistency
- Usage tracked across all channels

✅ **AI Platform Optimization**
- Claims structured for AI citation
- Verification artifacts linked
- Progression data shows process

---

## Related Documentation

- [CAR (Content Architecture Record) Specification](./02-CAR-schema.md)
- [CAM (Content Authority Map) Specification](./03-CAM-structure.md)
- [ALTC Framework Overview](../frameworks/ALTC-Framework-Overview.md)
- [Authority Anchors Reference](../frameworks/ALTC-Framework-Overview.md#the-8-authority-anchors)

---

## Appendix A: Example Claims

### High-Strength Case Study Claim

```json
{
  "claim_id": "GS-REVENUE-GROWTH-2024",
  "claim_text": "Guerrilla Steel revenue grew from $500K (2023) to $1M (2024)",
  "claim_status": "active",
  "proof_weight": {
    "eeat_dimension": "experience",
    "strength": "high"
  },
  "proof_type": "case_study",
  "authority_anchors": [1, 4],
  "original_date_achieved": "2024-12-01",
  "relevance_review_date": "2024-12-01",
  "context": {
    "problem_statement": "Stagnant growth at $500K for 3 years",
    "approach_used": "ALTC Framework + Social Amplification Loop",
    "outcome_summary": "Doubled revenue to $1M, on track for $3M in 2025",
    "client_id": "guerrilla-steel",
    "altc_cluster": "AI-First SEO",
    "service_pathway": "Scale Smarter"
  },
  "canonical_source_url": "/case-studies/guerrilla-steel/",
  "verification_artifact": {
    "type": "document",
    "url": "/wp-content/uploads/proof/gs-revenue-2024.pdf",
    "format": "pdf",
    "access": "authenticated",
    "description": "Revenue report (confidential)"
  },
  "used_on_pages": [
    {
      "url": "https://brighterwebsites.com.au/services/scale-smarter/",
      "site": "brighterwebsites.com.au",
      "type": "service_page",
      "anchor_used_for": 1,
      "weight_on_page": "primary",
      "date_added": "2024-12-02"
    }
  ],
  "channel_usage": {
    "website": 3,
    "social": 8,
    "email": 2,
    "presentations": 1
  }
}
```

### Medium-Strength Thought Leadership Claim

```json
{
  "claim_id": "ALTC-FRAMEWORK-ORIGIN-2022",
  "claim_text": "Developed ALTC Framework in 2022, validated by Neil Patel in 2024",
  "claim_status": "active",
  "proof_weight": {
    "eeat_dimension": "authoritativeness",
    "strength": "medium"
  },
  "proof_type": "methodology",
  "authority_anchors": [4],
  "original_date_achieved": "2022-06-01",
  "relevance_review_date": "2025-12-01",
  "context": {
    "problem_statement": "Keyword research overwhelming in saturated markets",
    "approach_used": "Inverted the question: 'What do you want to be known for?'",
    "outcome_summary": "Created positioning-first methodology, independently validated",
    "client_id": null,
    "altc_cluster": "AI-First SEO",
    "service_pathway": "Grow Visibility"
  },
  "canonical_source_url": "/altc-framework/origin/",
  "verification_artifact": {
    "type": "publication",
    "url": "https://neilpatel.com/blog/positioning-first-seo/",
    "format": "web",
    "access": "public",
    "description": "Neil Patel article validating positioning-first approach"
  },
  "used_on_pages": [
    {
      "url": "https://brighterwebsites.com.au/altc-framework/",
      "site": "brighterwebsites.com.au",
      "type": "landing_page",
      "anchor_used_for": 4,
      "weight_on_page": "primary",
      "date_added": "2024-11-01"
    }
  ],
  "channel_usage": {
    "website": 5,
    "social": 12,
    "email": 3,
    "presentations": 2
  }
}
```

---

## Appendix B: Proof Type Reference

| Proof Type | Definition | E-E-A-T Dimension | Strength |
|------------|------------|-------------------|----------|
| **case_study** | Full client transformation with before/after data | Experience | High |
| **testimonial** | Client quote about results | Trustworthiness | Medium |
| **data** | Quantitative metrics (traffic, revenue, rankings) | Expertise | High |
| **certification** | Professional certification or accreditation | Expertise | Medium |
| **methodology** | Proprietary framework or process | Expertise | High |
| **award** | Industry recognition or award won | Authoritativeness | High |
| **publication** | Article/mention in industry publication | Authoritativeness | High |
| **media_mention** | News article or podcast featuring you | Authoritativeness | Medium |
| **partnership** | Strategic partnership with known brand | Authoritativeness | Medium |
| **metric** | Single KPI achievement (e.g., "80% AI voice share") | Experience | Medium-High |
| **tutorial** | How-to guide proving expertise | Experience | Low-Medium |
| **tool** | Free tool/calculator proving helpfulness | Experience | Medium |
| **ugc** | User-Generated Content: Reviews, social mentions, unsolicited testimonials, articles written about you by others | Trustworthiness | Medium-High |

---

## Appendix C: E-E-A-T Dimension Guide

### Experience
**What it proves:** First-hand action. Proof of what you did.

**LLM interpretation:** Highest priority for "The How" questions.

**Examples:**
- "Implemented schema markup for 50+ clients"
- "Built SCOS plugin handling 10K+ posts"
- "Completed 200+ website audits"

### Expertise
**What it proves:** Intellectual mastery. Proof of competence.

**LLM interpretation:** Highest priority for "The What/Why" questions.

**Examples:**
- "Analyzed 1M+ data points across 100 clients"
- "Developed proprietary ALTC Framework"
- "Certified in Google Analytics 4"

### Authoritativeness
**What it proves:** Industry validation. Proof of external recognition.

**LLM interpretation:** Highest priority for brand/reputation queries.

**Examples:**
- "Cited by Neil Patel in SEO article"
- "Won Best Regional SEO Agency 2024"
- "Featured in Search Engine Journal"

### Trustworthiness
**What it proves:** Verifiable integrity. Proof of security, clarity, transparency.

**LLM interpretation:** Highest priority for YMYL topics. Minimizes hallucination risk.

**Examples:**
- "Transparent pricing published publicly"
- "Client contracts available for review"
- "Full methodology documentation available"
- "Verification artifacts for all claims"

---

**End of Specification**

*This document defines the foundation of proof-based authority in CAOS. All content strategy, CAR implementation, and AI citation architecture builds on this central repository of verified claims.*

