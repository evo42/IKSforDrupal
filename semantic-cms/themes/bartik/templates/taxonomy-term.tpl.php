<?php
// $Id: taxonomy-term.tpl.php,v 1.1 2010/02/10 06:28:10 webchick Exp $

/**
 * @file
 * Default theme implementation to display a term.
 *
 * Available variables:
 * - $name: the (sanitized) name of the term.
 * - $content: An array of items for the content of the term (fields and
 *   description). Use render($content) to print them all, or print a subset
 *   such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $term_url: Direct url of the current term.
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the following:
 *   - taxonomy-term: The current template type, i.e., "theming hook".
 *   - vocabulary-[vocabulary-name]: The vocabulary to which the term belongs to.
 *     For example, if the term is a "Tag" it would result in "vocabulary-tag".
 *
 * Other variables:
 * - $term: Full term object. Contains data that may not be safe.
 * - $view_mode: View mode, e.g. 'full', 'teaser'...
 * - $page: Flag for the full page state.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the term. Increments each time it's output.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * @see template_preprocess()
 * @see template_preprocess_taxonomy_term()
 * @see template_process()
 */

?>
<div id="taxonomy-term-<?php print $term->tid; ?>" class="<?php print $classes; ?> clearfix">

  <?php if (!$page): ?>
    <h2><a href="<?php print $term_url; ?>"><?php print $term_name; ?></a></h2>
  <?php endif; ?>

  <div class="content">
  
    <?php 
    hide($content['field_concept_uri']);
    print render($content);
    $row_id = $id-1;

    if ($content['field_concept_uri']['#items'][$row_id]['safe_value']) {
    	$concept_uri = $content['field_concept_uri']['#items'][$row_id]['safe_value'];
    	echo '<div xmlns:ctag="http://commontag.org/ns#" about="'.url('taxonomy/term/'.$term->tid, array('absolute' => true)).'" rel="ctag:tagged">';
    	echo '<span typeof="ctag:Tag" rel="ctag:means" resource="'.$concept_uri.'" />';
    	echo '</div>';
    
	$metadata = @file_get_contents('http://stanbol.iksfordrupal.net:9000/entityhub/sites/entity?id='.$concept_uri);
	$metadata = json_decode($metadata);
	if (is_object($metadata)) {
	$concept_info = (array) $metadata->representation;
	$concept = false;
	
	/*foreach($concept_info as $key => $info) {
		echo $key.'<br />';
	}*/
	
	// http://dbpedia.org/ontology/thumbnail
	$concept->img_thumbnail = false;
	if (isset($concept_info['http://dbpedia.org/ontology/thumbnail'])) {
		$concept->img_thumbnail = $concept_info['http://dbpedia.org/ontology/thumbnail'][0]->value;
	}
	
	// http://xmlns.com/foaf/0.1/depiction
	$concept->img_depiction = false;
	if (isset($concept_info['http://xmlns.com/foaf/0.1/depiction'])) {
		$concept->img_depiction = $concept_info['http://xmlns.com/foaf/0.1/depiction'][0]->value;
	}
	
	// http://xmlns.com/foaf/0.1/homepage
	$concept->homepage = false;
	if (isset($concept_info['http://xmlns.com/foaf/0.1/homepage'])) {
		$concept->homepage = $concept_info['http://xmlns.com/foaf/0.1/homepage'][0]->value;
	}

	// http://dbpedia.org/property/shortDescription
	$concept->shortDescription = false;
	if (isset($concept_info['http://dbpedia.org/property/shortDescription'])) {
		$concept->shortDescription = $concept_info['http://dbpedia.org/property/shortDescription'][0]->value;
	}

	// http://xmlns.com/foaf/0.1/name
	$concept->foaf_name = false;
	if (isset($concept_info['http://xmlns.com/foaf/0.1/name'])) {
		$concept->foaf_name = $concept_info['http://xmlns.com/foaf/0.1/name'][0]->value;
	}

	// http://www.w3.org/2002/07/owl#sameAs
	$concept->url_lod_sameAs = false;
	if (isset($concept_info['http://www.w3.org/2002/07/owl#sameAs'])) {
		foreach($concept_info['http://www.w3.org/2002/07/owl#sameAs'] as $page) {
			$concept->url_lod_sameAs[] = $page->value;
		}
	}

	// http://www.w3.org/2000/01/rdf-schema#label
	$concept->label = false;
	if (isset($concept_info['http://www.w3.org/2000/01/rdf-schema#label'])) {
		foreach($concept_info['http://www.w3.org/2000/01/rdf-schema#label'] as $label) {
			$label = (array) $label;
			if ($label['xml:lang'] == 'en') {
				$concept->label = $label['value'];
			}
		}
	}
	
	// http://dbpedia.org/property/name
	$concept->name = false;
	if (isset($concept_info['http://dbpedia.org/property/name'])) {
		$concept->name = $concept_info['http://dbpedia.org/property/name'][0]->value;
	}
	
	// http://xmlns.com/foaf/0.1/page
	$concept->page = false;
	if (isset($concept_info['http://xmlns.com/foaf/0.1/page'])) {
		$concept->page = $concept_info['http://xmlns.com/foaf/0.1/page'][0]->value;
	}
	
	// http://dbpedia.org/ontology/wikiPageExternalLink
	$concept->url_external_pages = false;
	if (isset($concept_info['http://dbpedia.org/ontology/wikiPageExternalLink'])) {
		foreach($concept_info['http://dbpedia.org/ontology/wikiPageExternalLink'] as $page) {
			$concept->url_external_pages[] = $page->value;
		}
	}
	
	// [http://dbpedia.org/ontology/abstract]
	$concept->abstract = false;
	if (isset($concept_info['http://dbpedia.org/ontology/abstract'])) {
		foreach($concept_info['http://dbpedia.org/ontology/abstract'] as $abstract) {
			$abstract = (array) $abstract;
			if ($abstract['xml:lang'] == 'en') {
				$concept->abstract = $abstract['value'];
			}
		}
	}
	
	
	/*
	echo '<pre>';
	print_r($concept);
	echo '</pre>';
	//*/

	echo '<div id="apache-stanbol-metadata-'.$term->tid.'" class="apache-stanbol-metadata">';
		if ($concept->shortDescription) {
			echo '<p><strong>'.l($concept->label, $concept->homepage).', '.$concept->shortDescription.'.</strong></p>';
		} else {
			echo '<p><strong>'.l($concept->label, $concept->homepage).'</strong></p>';
		}
		echo '<p>';
		if ($concept->img_thumbnail) {
			echo '<img style="float:left; margin: 10px;" class="apache-stanbol-metadata-thumbnail" src="'.$concept->img_thumbnail.'" title="'.$concept->name.'" />';
		}
		echo $concept->abstract.'</p>';
		echo '<p>On the web: ';
			echo '<ul>';
			foreach($concept->url_external_pages as $page) {
				$page_url = parse_url($page);
				echo '<li>'.l($page_url['host'], $page).'</li>';
			}
			echo '</ul>';
		echo '</p>';
		echo '<p>Source: '.l('Wikipedia Article', $concept->page).' about '.$concept->label.'</p>';
	echo '</div>';
	}
	
	}

	render($content['field_concept_uri']);

    ?>
  </div>

</div>
