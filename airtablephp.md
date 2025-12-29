<?php
// This is here just for reference, it is not "used" in my mu-plugin - this code it is currently deployed via Advanced Scripts - per site. 
// Airtable is being used as an intermediary CAR/CAM database for use case building/understanding. 
// CAR - Content ARchitecture Record(page level directive) - CAM - Content Authority Map(site level intellegence and directive) 
// CAR/CAM used for Stragegic Content Operating System and possible AI/LLM Ingestion - maybe a next evolution of (LLMs.txt+Schema).
// Send "CAR" data to Airtable on post save

add_action('save_post', 'sync_car_to_airtable', 10, 3);

function sync_car_to_airtable($post_id, $post, $update) {
    // Skip autosave/revisions first (before other checks)
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id)) return;
    
    // Get post object if not provided
    if (!$post) {
        $post = get_post($post_id);
        if (!$post) return;
    }
    
    // Only sync published content
    if ($post->post_status !== 'publish') {
        error_log(sprintf('Airtable sync skipped: Post %d status is "%s" (not published)', $post_id, $post->post_status));
        return;
    }
    
    // Only sync specific post types (not media/attachments)
    $allowed_post_types = ['post', 'page', 'kb', 'news', 'folio'];
    if (!in_array($post->post_type, $allowed_post_types, true)) {
        error_log(sprintf('Airtable sync skipped: Post %d type "%s" not in allowed list', $post_id, $post->post_type));
        return;
    }
    
    // Rate limiting: Check last sync time (prevent rapid-fire updates)
    $last_sync = get_post_meta($post_id, '_airtable_last_sync', true);
    $now = time();
    if ($last_sync && ($now - $last_sync) < 5) {
        error_log(sprintf('Airtable sync skipped: Post %d synced %d seconds ago (rate limit)', $post_id, $now - $last_sync));
        return; // Don't sync if updated within last 5 seconds
    }
    
    $car = get_post_meta($post_id, '_scos_car', true);
    
    // Get ALTC Cluster and Topic names
    // Method 1: Try meta fields first (from custom dropdowns)
    $primary_altc_id = get_post_meta($post_id, 'bw_primary_altc_id', true);
    $primary_topic_id = get_post_meta($post_id, 'bw_primary_topic_id', true);
    
    $altc_name = '';
    $topic_name = '';
    
    // Get ALTC Cluster name
    if ($primary_altc_id) {
        $altc_term = get_term($primary_altc_id, 'altc_strategic_lens');
        if ($altc_term && !is_wp_error($altc_term)) {
            $altc_name = $altc_term->name;
        }
    }
    
    // Fallback: Get from taxonomy if meta field empty
    if (empty($altc_name)) {
        $altc_terms = wp_get_post_terms($post_id, 'altc_strategic_lens', ['fields' => 'names']);
        $altc_name = !empty($altc_terms) ? $altc_terms[0] : '';
    }
    
    // Get Topic name
    if ($primary_topic_id) {
        $topic_term = get_term($primary_topic_id, 'altc_topic');
        if ($topic_term && !is_wp_error($topic_term)) {
            $topic_name = $topic_term->name;
        }
    }
    
    // Fallback: Get from taxonomy if meta field empty
    if (empty($topic_name)) {
        $topic_terms = wp_get_post_terms($post_id, 'altc_topic', ['fields' => 'names']);
        $topic_name = !empty($topic_terms) ? $topic_terms[0] : '';
    }
    
    $airtable_data = [
        // Basic post info
        'Post ID' => $post_id,
        'Title' => $post->post_title,
        'URL' => get_permalink($post_id),
        'Published Date' => get_the_date('Y-m-d', $post_id),
        'Last Modified Date' => get_the_modified_date('Y-m-d', $post_id),
        'PostType' => $post->post_type,
        
        // ALTC Strategy fields
        'Maturity Level' => get_post_meta($post_id, 'bw_cont_maturity', true),
        'Content Intent' => get_post_meta($post_id, 'bw_intent', true),
        'Content Purpose' => get_post_meta($post_id, 'bw_purpose', true),
        
        // Taxonomy/Category (you may need to adjust based on your category taxonomy)
        'Category' => wp_get_post_categories($post_id, ['fields' => 'names'])[0] ?? '',
        
        // Pillar relationship
        'Pillar' => get_post_meta($post_id, 'bw_pillar_page_id', true) 
            ? get_the_title(get_post_meta($post_id, 'bw_pillar_page_id', true)) 
            : '',
        
        // Content Analysis
        'Internal Links' => (int) get_post_meta($post_id, 'bw_internal_link_count', true),
        'Internal Links Out' => (int) get_post_meta($post_id, 'bw_external_link_count', true),

        'Word Count' => (int) get_post_meta($post_id, 'bw_word_count', true),
      
        'H2 Count' => (int) get_post_meta($post_id, 'bw_h2_count', true),
        'Image Count' => (int) get_post_meta($post_id, 'bw_image_count', true),

        // Analyzed Date - extract date from MySQL datetime (YYYY-MM-DD HH:MM:SS)
        'Analysed Date' => ($analyzed = get_post_meta($post_id, '_bw_last_analyzed', true)) 
            ? substr($analyzed, 0, 10) // Extract YYYY-MM-DD
            : '',

//SEOPRESS FIELDS TEMP USE
        'IndexTagSet' => get_post_meta($post_id, '_seopress_robots_index', true),
        'CanonicalSet' => get_post_meta($post_id, '_seopress_robots_canonical', true),
        'SEOBreadcrumbs' => get_post_meta($post_id, '_seopress_robots_breadcrumbs', true),
        'shortlinktext' => get_post_meta($post_id, '_bw_breadcrumb', true),  //Not Sending


        // Optimization & Index Status
        'Optimization Status' => get_post_meta($post_id, '_brt_opt_status', true),
        'Index Status' => get_post_meta($post_id, 'bw_index_status', true),
        
        // Content fields
        'TLDR' => get_post_meta($post_id, 'bw_tldr', true), // Standardized field (migrated from ACF 'tldr')
        'Excerpt' => $post->post_excerpt ?: wp_trim_words($post->post_content, 55, '...'),
        'MetaTitle' => get_post_meta($post_id, '_yoast_wpseo_title', true) 
            ?: get_post_meta($post_id, '_seopress_titles_title', true), // SEOPress fallback
        'Meta Description' => get_post_meta($post_id, '_yoast_wpseo_metadesc', true)
            ?: get_post_meta($post_id, '_seopress_titles_desc', true), // SEOPress fallback


        

        // Notes
        'Content Notes' => get_post_meta($post_id, 'bw_notes', true),//works was empty 
        
        // ALTC Cluster and Topics - SEND AS TEXT (Airtable fields should be Text type)
        // Using Post ID as mapping key - these fields sync via term names
        'ALTC Cluster' => $altc_name,
        'Topics' => $topic_name,
    ];
    
    // Remove empty values to keep Airtable clean
    $airtable_data = array_filter($airtable_data, function($value) {
        return $value !== '' && $value !== null && $value !== 0;
    });
    
    $api_token = 'Bearer abc123';
    $base_url = 'https://api.airtable.com/v0/app1234567890/Content';
    
    // Check if Airtable record already exists for this post
    $airtable_record_id = get_post_meta($post_id, '_airtable_record_id', true);
    
    if ($airtable_record_id) {
        // UPDATE existing record (PATCH)
        $response = wp_remote_request($base_url . '/' . $airtable_record_id, [
            'method' => 'PATCH',
            'headers' => [
                'Authorization' => $api_token,
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode(['fields' => $airtable_data]),
            'timeout' => 15
        ]);
        
        // If record not found (deleted in Airtable), create new one
        if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 404) {
            delete_post_meta($post_id, '_airtable_record_id');
            $airtable_record_id = false;
        }
    }
    
    if (!$airtable_record_id) {
        // CREATE new record (POST)
        $response = wp_remote_post($base_url, [
            'headers' => [
                'Authorization' => $api_token,
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode(['fields' => $airtable_data]),
            'timeout' => 15
        ]);
        
        // Store Airtable record ID for future updates
        if (!is_wp_error($response)) {
            $body = json_decode(wp_remote_retrieve_body($response), true);
            if (isset($body['id'])) {
                update_post_meta($post_id, '_airtable_record_id', $body['id']);
            }
        }
    }
    
    // Log errors for debugging
    if (is_wp_error($response)) {
        error_log(sprintf('[Airtable Sync] ERROR for post %d (%s): %s', 
            $post_id, $post->post_type, $response->get_error_message()));
    } else {
        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        
        if ($status_code === 200 || $status_code === 201) {
            // Success - update last sync time
            update_post_meta($post_id, '_airtable_last_sync', time());
            error_log(sprintf('[Airtable Sync] SUCCESS: Post %d (%s) synced to Airtable', 
                $post_id, $post->post_type));
        } elseif ($status_code === 429) {
            // Rate limit hit
            error_log(sprintf('[Airtable Sync] RATE LIMIT: Post %d (%s) - Airtable rate limit exceeded. Retry later.', 
                $post_id, $post->post_type));
        } elseif ($status_code === 422) {
            // Validation error - log details for debugging
            $error_data = json_decode($body, true);
            $error_message = $error_data['error']['message'] ?? 'Unknown validation error';
            $error_type = $error_data['error']['type'] ?? 'UNKNOWN';
            
            error_log(sprintf('[Airtable Sync] VALIDATION ERROR for post %d (%s): %s (Type: %s)', 
                $post_id, $post->post_type, $error_message, $error_type));
            
            // Log what we're trying to send for debugging
            error_log(sprintf('[Airtable Sync] Data sent: %s', json_encode($airtable_data, JSON_PRETTY_PRINT)));
            
            // Common fixes:
            // 1. If "record IDs" error - Airtable field is still Linked Record type (change to Text)
            // 2. If "invalid value" - Field value doesn't match Airtable dropdown options
            // 3. If "missing required" - Required field is empty
        } else {
            // Other error
            error_log(sprintf('[Airtable Sync] API ERROR for post %d (%s): Status %d, Response: %s', 
                $post_id, $post->post_type, $status_code, $body));
        }
    }
    
    /**
     * IMPORTANT NOTES:
     * 
     * 1. LINKED RECORDS: 'ALTC Cluster' and 'Topics' fields
     *    - Currently sending term names as strings
     *    - For true Airtable linked records, you need:
     *      a) Airtable record IDs stored in WP term meta, OR
     *      b) Use Airtable's "typecast" parameter to auto-create records
     *    
     * 2. INTERNAL LINKS IN: 
     *    - Currently set to 0
     *    - Need to query all posts that link TO this post_id
     *    - Can be expensive, consider caching or background processing
     * 
     * 3. DUPLICATE DETECTION:
     *    - This creates a NEW record each time
     *    - Consider using "Post ID" as external ID to UPDATE existing records
     *    - Use PATCH instead of POST for updates
     * 
     * 4. FIELD MAPPING VALIDATION:
     *    - Ensure Airtable field names match EXACTLY (case-sensitive)
     *    - Date fields must be in ISO format (YYYY-MM-DD)
     *    - Number fields must be integers or floats (not strings)
     */
}

// ============================================
// AIRTABLE → WORDPRESS SYNC (Webhook Receiver)
// ============================================
// DISABLED: Requires Make.com or custom webhook setup
// To enable: Uncomment the entire section below (lines 196-387)

/*
// Register REST endpoint to receive Airtable updates
add_action('rest_api_init', function() {
    register_rest_route('scos/v1', '/sync-car', [
        'methods' => 'POST',
        'callback' => 'handle_airtable_webhook',
        'permission_callback' => 'verify_airtable_webhook',
    ]);
});

// Verify webhook authenticity
function verify_airtable_webhook($request) {
    // Option 1: Bearer token (simplest - use this for testing)
    $auth_header = $request->get_header('Authorization');
    $expected_token = 'Bearer 5OHxwlAHPOHOURM3k722ZnXVfEDujGWOE'; // Change this!
    
    if ($auth_header !== $expected_token) {
        return new WP_Error('unauthorized', 'Invalid authorization token', ['status' => 401]);
    }
    
    return true;
    
    // Option 2: Airtable IP whitelist (more secure)
    // Uncomment and use this in production:
    /*
    $allowed_ips = [
        '18.211.123.71',  // Airtable IPs
        '18.205.245.195',
        '3.216.137.75',
        '3.218.143.118',
    ];
    
    $request_ip = $_SERVER['REMOTE_ADDR'] ?? '';
    if (!in_array($request_ip, $allowed_ips, true)) {
        return new WP_Error('forbidden', 'IP not whitelisted', ['status' => 403]);
    }
    
    return true;
}
*/

/**
 * Handle incoming webhook from Airtable
 */
function handle_airtable_webhook($request) {
    $data = $request->get_json_params();
    
    // Validate required fields
    if (empty($data['post_id'])) {
        return new WP_Error('missing_data', 'Post ID required', ['status' => 400]);
    }
    
    $post_id = intval($data['post_id']);
    
    // Verify post exists
    $post = get_post($post_id);
    if (!$post) {
        return new WP_Error('not_found', 'Post not found', ['status' => 404]);
    }
    
    // Prevent infinite loop: don't trigger save_post action
    remove_action('save_post', 'sync_car_to_airtable');
    
    $updated_fields = [];
    
    // Update CAR fields from Airtable
    if (isset($data['car_updates'])) {
        $car_updates = $data['car_updates'];
        
        // Map Airtable field names to WordPress meta keys
        $field_map = [
            'maturity_level' => 'bw_cont_maturity',
            'content_intent' => 'bw_intent',
            'content_purpose' => 'bw_purpose',
            'optimization_status' => '_brt_opt_status',
            'index_status' => 'bw_index_status',
            'pillar_article' => 'bw_pillar_page_id',
            'content_notes' => 'bw_notes',
            'breadcrumbs' => 'bw_breadcrumbs',
            'tldr' => 'bw_tldr', // Standardized field (migrated from ACF)
        ];
        
        foreach ($field_map as $airtable_field => $wp_meta_key) {
            if (isset($car_updates[$airtable_field])) {
                $value = $car_updates[$airtable_field];
                
                // Special handling for pillar article (convert title to ID)
                if ($airtable_field === 'pillar_article' && !is_numeric($value)) {
                    $pillar_post = get_page_by_title($value, OBJECT, ['post', 'page']);
                    $value = $pillar_post ? $pillar_post->ID : '';
                }
                
                update_post_meta($post_id, $wp_meta_key, $value);
                $updated_fields[] = $airtable_field;
            }
        }
    }
    
    // Update post fields (title, excerpt, etc.)
    if (isset($data['post_updates'])) {
        $post_updates = $data['post_updates'];
        $wp_update = ['ID' => $post_id];
        
        if (isset($post_updates['title'])) {
            $wp_update['post_title'] = sanitize_text_field($post_updates['title']);
            $updated_fields[] = 'title';
        }
        
        if (isset($post_updates['excerpt'])) {
            $wp_update['post_excerpt'] = sanitize_textarea_field($post_updates['excerpt']);
            $updated_fields[] = 'excerpt';
        }
        
        if (count($wp_update) > 1) {
            wp_update_post($wp_update);
        }
    }
    
    // Re-enable the sync action
    add_action('save_post', 'sync_car_to_airtable', 10, 3);
    
    return new WP_REST_Response([
        'success' => true,
        'post_id' => $post_id,
        'updated_fields' => $updated_fields,
        'message' => sprintf('Updated %d fields for post %d', count($updated_fields), $post_id)
    ], 200);
}

/**
 * AIRTABLE AUTOMATION SCRIPT
 * 
 * Copy this JavaScript code into Airtable Automation:
 * Trigger: When record updated
 * Action: Run script
 * 
 * --------------------------------------------
 * 
 * let config = input.config();
 * let record = config.record;
 * 
 * // Your WordPress site URL
 * const wpUrl = 'https://brighterwebsites.com.au/wp-json/scos/v1/sync-car';
 * 
 * // Generate a strong token and match it in verify_airtable_webhook()
 * const authToken = 'Bearer YOUR_SECRET_TOKEN_HERE';
 * 
 * // Prepare data to send
 * const payload = {
 *     post_id: record.getCellValue('Post ID'),
 *     car_updates: {
 *         maturity_level: record.getCellValueAsString('Maturity Level'),
 *         content_intent: record.getCellValueAsString('Content Intent'),
 *         content_purpose: record.getCellValueAsString('Content Purpose'),
 *         optimization_status: record.getCellValueAsString('Optimization Status'),
 *         content_notes: record.getCellValueAsString('Content Notes')
 *     },
 *     post_updates: {
 *         excerpt: record.getCellValueAsString('Excerpt')
 *     }
 * };
 * 
 * // Send webhook to WordPress
 * let response = await fetch(wpUrl, {
 *     method: 'POST',
 *     headers: {
 *         'Content-Type': 'application/json',
 *         'Authorization': authToken
 *     },
 *     body: JSON.stringify(payload)
 * });
 * 
 * if (response.ok) {
 *     console.log('✅ Synced to WordPress:', await response.json());
 * } else {
 *     console.error('❌ Sync failed:', response.status, await response.text());
 * }
 * 
 * --------------------------------------------
 */

