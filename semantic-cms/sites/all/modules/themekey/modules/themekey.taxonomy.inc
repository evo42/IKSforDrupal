<?php
// $Id: themekey.taxonomy.inc,v 1.15.2.6 2011/01/09 09:30:56 mkalkbrenner Exp $

/**
 * @file
 * Provides some taxonomy stuff as ThemeKey properties.
 *
 * @author Markus Kalkbrenner | Cocomore AG
 *   @see http://drupal.org/user/124705
 *
 * @author profix898
 *   @see http://drupal.org/user/35192
 */


/**
 * Implements hook_themekey_properties().
 *
 * Provides additional properties for the Themekey module:
 * - taxonomy:vid
 * - taxonomy:tid
 * - taxonomy:tid_and_childs
 *
 * @return
 *   array of themekey properties and mapping functions
 */
function themekey_taxonomy_themekey_properties() {
  // Attributes for properties ;)
  $attributes = array();
  $attributes['taxonomy:vid'] = array(
    'description' => t('Taxonomy: Vocabulary - The vocabulary id (vid) of a taxonomy vocabulary. See !link for your vocabularies.',
      array('!link' => l(t('!path', array('!path' => 'admin/structure/taxonomy')), 'admin/structure/taxonomy'))),
    'validator' => 'themekey_validator_ctype_digit',
    'page cache' => THEMEKEY_PAGECACHE_SUPPORTED,
  );
  $attributes['taxonomy:tid'] = array(
    'description' => t('Taxonomy: Term - The term id (tid) of a taxonomy term.'),
    'validator' => 'themekey_validator_ctype_digit',
    'page cache' => THEMEKEY_PAGECACHE_SUPPORTED,
  );
  $attributes['taxonomy:tid_and_childs'] = array(
    'description' => t('Taxonomy: Term and its childs - The term id (tid) of a taxonomy term. If set, all child terms of this term will be used too.'),
    'validator' => 'themekey_validator_ctype_digit',
    'page cache' => THEMEKEY_PAGECACHE_UNSUPPORTED,
  );

  // Mapping functions
  $maps = array();
  $maps[] = array(
    'src' => 'taxonomy:tid',
    'dst' => 'taxonomy:vid',
    'callback' => 'themekey_taxonomy_tid2vid',
  );
  $maps[] = array(
    'src' => 'taxonomy:tid',
    'dst' => 'taxonomy:tid_and_childs',
    'callback' => 'themekey_taxonomy_tid2tid_and_parents',
  );
  $maps[] = array(
    'src' => 'node:vid',
    'dst' => 'taxonomy:vid',
    'callback' => 'themekey_taxonomy_vid2vid',
  );
  $maps[] = array(
    'src' => 'node:vid',
    'dst' => 'taxonomy:tid',
    'callback' => 'themekey_taxonomy_vid2tid',
  );
  $maps[] = array(
    'src' => 'node:vid',
    'dst' => 'taxonomy:tid_and_childs',
    'callback' => 'themekey_taxonomy_vid2tid_and_parents',
  );

  return array('attributes' => $attributes, 'maps' => $maps);
}


/**
 * Implements hook_themekey_paths().
 */
function themekey_taxonomy_themekey_paths() {
  $paths = array();
  $paths[] = array('path' => 'taxonomy/term/#taxonomy:tid');

  // Add support for 'forum' paths
  if (module_exists('forum') && variable_get('themekey_module_forum_triggers_taxonomy_vid', 0)) {
    $paths[] = array('path' => 'forum/#taxonomy:vid');
  }

  return $paths;
}


/**
 * ThemeKey mapping function to set a
 * ThemeKey property's value (destination)
 * with the aid of another ThemeKey property (source).
 *
 * src: taxonomy:tid
 * dst: taxonomy:vid
 *
 * @param $tids
 *   array of taxonomy term ids or a single term id
 *
 * @return
 *   array of taxonomy vocabulary ids
 *   or NULL if no value could be mapped
 */
function themekey_taxonomy_tid2vid($tids) {
  $vid = array();
  // Use SQL instead taxonomy API because this code runs during hook_init() stage.
  // Using taxonomy API will require to load the node using node_load() which is not allowed in this stage.
  $tids = is_array($tids) ? $tids : array($tids);
  foreach ($tids as $tid) {
    $vid[] = db_query('SELECT vid FROM {taxonomy_term_data} WHERE tid = :tid', array(':tid' => $tid))->fetchField();
  }

  return count($vid) ? $vid : NULL;
}


/**
 * ThemeKey mapping function to set a
 * ThemeKey property's value (destination)
 * with the aid of another ThemeKey property (source).
 *
 * src: node:vid
 * dst: taxonomy:vid
 *
 * @param $node_vid
 *   node version id
 *
 * @return
 *   array of taxonomy vocabulary ids
 *   or NULL if no value could be mapped
 */
function themekey_taxonomy_vid2vid($node_vid) {
  $vids = array();

  // Use SQL instead taxonomy API because this code runs during hook_init() stage.
  // Using taxonomy API will require to load the node using node_load() which is not allowed in this stage.

  //  GET THE TAXONOMY VOCABULARIES
  $taxonomy_vocabularies = taxonomy_get_vocabularies();

  if (!empty($taxonomy_vocabularies)) {

    $entities = array();

    $args = array();
    $sql  = 'SELECT n.* ';
    $sql .= 'FROM {node_revision} nr ';
    $sql .= 'INNER JOIN {node} n ON n.nid = nr.nid ';
    $sql .= 'WHERE nr.vid = :vid';
    $args[':vid'] = $node_vid;
    $result = db_query($sql, $args);

    if (!empty($result)) {
      foreach ($result as $item) {
        $item->vid = $node_vid;
        $entities[$item->nid] = $item;
        $nid = $item->nid;
      }

      if (!empty($entities)) {

        field_attach_load_revision('node', $entities);

        foreach ($taxonomy_vocabularies as $key => $vocabulary) {

          $field_name = 'field_' . $vocabulary->machine_name;

          if (!empty($entities[$nid]->$field_name)) {

            $vids[$vocabulary->vid] = $vocabulary->vid;

          }

        }

      }

    }

  }

  return count($vids) ? $vids : NULL;
}


/**
 * ThemeKey mapping function to set a
 * ThemeKey property's value (destination)
 * with the aid of another ThemeKey property (source).
 *
 * src: node:vid
 * dst: taxonomy:tid
 *
 * @param $node_vid
 *   node version id
 *
 * @return
 *   array of taxonomy term ids
 *   or NULL if no value could be mapped
 */
function themekey_taxonomy_vid2tid($node_vid) {
  $tids = array();

  // Use SQL instead taxonomy API because this code runs during hook_init() stage.
  // Using taxonomy API will require loading the node using node_load() which is not allowed in this stage.

  //  GET THE TAXONOMY VOCABULARIES
  $taxonomy_vocabularies = taxonomy_get_vocabularies();

  if (!empty($taxonomy_vocabularies)) {

    $entities = array();

    $args = array();
    $sql  = 'SELECT n.* ';
    $sql .= 'FROM {node_revision} nr ';
    $sql .= 'INNER JOIN {node} n ON n.nid = nr.nid ';
    $sql .= 'WHERE nr.vid = :vid';
    $args[':vid'] = $node_vid;
    $result = db_query($sql, $args);

    if (!empty($result)) {
      foreach ($result as $item) {
        $item->vid = $node_vid;
        $entities[$item->nid] = $item;
        $nid = $item->nid;
      }

      if (!empty($entities)) {

        field_attach_load_revision('node', $entities);

        foreach ($taxonomy_vocabularies as $key => $vocabulary) {

          $field_name = 'field_' . $vocabulary->machine_name;

          if (!empty($entities[$nid]->$field_name)) {

            $field_items = field_get_items('node', $entities[$nid], $field_name);

            if (!empty($field_items)) {
              foreach ($field_items as $key => $item_array) {
                $tids[] = $item_array['tid'];
              }
            }

          }

        }

      }

    }

  }

  return count($tids) ? $tids : NULL;
}


/**
 * ThemeKey mapping function to set a
 * ThemeKey property's value (destination)
 * with the aid of another ThemeKey property (source).
 *
 * src: node:vid
 * dst: taxonomy:tid_and_parents
 *
 * @param $node_vid
 *   node version id
 *
 * @return
 *   array of taxonomy term ids
 *   or NULL if no value could be mapped
 */
function themekey_taxonomy_vid2tid_and_parents($node_vid) {

  $node_tids = themekey_taxonomy_vid2tid($node_vid);
  if (!is_array($node_tids)) {
    return FALSE;
  }
  $tids = $node_tids;
  foreach ($node_tids as $tid) {
    $parent_terms = taxonomy_get_parents_all($tid);
    foreach ($parent_terms as $parent_term) {
      $tids[] = $parent_term->tid;
    }
  }

  return count($tids) ? array_unique($tids) : NULL;
}


/**
 * ThemeKey mapping function to set a
 * ThemeKey property's value (destination)
 * with the aid of another ThemeKey property (source).
 *
 * src: taxonomy:tid
 * dst: taxonomy:tid_and_parents
 *
 * @param $tids
 *   array of taxonomy term ids or a single term id
 *
 * @return
 *   array of taxonomy term ids
 *   or NULL if no value could be mapped
 */
function themekey_taxonomy_tid2tid_and_parents($tids) {
  $tids = is_array($tids) ? $tids : array($tids);
  foreach ($tids as $tid) {
    // note that taxonomy_get_parents_all() returns the term itself
    $parent_terms = taxonomy_get_parents_all($tid);
    $parents = array();
    foreach ($parent_terms as $parent_term) {
      $parents[] = $parent_term->tid;
    }
  }

  return count($parents) ? array_unique($parents) : NULL;
}
