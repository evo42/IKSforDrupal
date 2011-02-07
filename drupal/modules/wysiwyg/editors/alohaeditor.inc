<?php
/**
 * @file
 * Editor integration functions for Aloha Editor.
 */

/**
 * Plugin implementation of hook_editor().
 */
 
// @todo search for sites/all/libraries/alohaeditor or alohaeditor plugin path
function wysiwyg_alohaeditor_editor() {
	global $base_url;
	
	//variable_set('zemanta_api_key', '1234567890');
	//variable_set('fise_api_endpoint', 'http://stanbol.iksfordrupal.net:9000/engines/');
	
drupal_add_js("

GENTICS.Aloha.settings = {
	logLevels: {'error': true, 'warn': true, 'info': false, 'debug': false},
	errorhandling : false,
	ribbon: false,
	proxyUrl: '". $base_url ."/sites/all/libraries/alohaeditor/plugins/com.gentics.aloha.plugins.Annotations/proxy.php?url=',
	\"i18n\": {
		// you can either let the system detect the users language (set acceptLanguage on server)
		// \"acceptLanguage\": 'de-de,de;q=0.8,it;q=0.6,en-us;q=0.7,en;q=0.2'
		// @todo from drupal config
		\"current\": \"en\" 
	},
	\"repositories\": {
	 	\"com.gentics.aloha.repositories.LinkList\": {
	 		data: [
 		        { name: 'Aloha Developers Wiki', url:'http://www.aloha-editor.com/wiki', type:'website', weight: 0.50 },
 		        { name: 'Aloha Editor - The HTML5 Editor', url:'http://aloha-editor.com', type:'website', weight: 0.90  },
 		        { name: 'Aloha Demo', url:'http://www.aloha-editor.com/demos.html', type:'website', weight: 0.75  },
 		        { name: 'Aloha Wordpress Demo', url:'http://www.aloha-editor.com/demos/wordpress-demo/index.html', type:'website', weight: 0.75  },
 		        { name: 'Aloha Logo', url:'http://www.aloha-editor.com/images/aloha-editor-logo.png', type:'image', weight: 0.10  }
			]
		}
	},
	\"plugins\": {
	 	\"com.gentics.aloha.plugins.Format\": {
		 	// all elements with no specific configuration get this configuration
			config : [ 'b', 'i','sub','sup'],
		  	editables : {
				// no formatting allowed for title
				'#title'	: [ ], 
				// formatting for all editable DIVs
				'div'		: [ 'b', 'i', 'del', 'sub', 'sup'  ], 
				// content is a DIV and has class .article so it gets both buttons
				'.article'	: [ 'b', 'i', 'p', 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'removeFormat']
		  	}
		},
	 	\"com.gentics.aloha.plugins.List\": { 
		 	// all elements with no specific configuration get an UL, just for fun :)
			config : [ 'ul' ],
		  	editables : {
				// Even if this is configured it is not set because OL and UL are not allowed in H1.
				'#title'	: [ 'ol' ], 
				// all divs get OL
				'div'		: [ 'ol' ], 
				// content is a DIV. It would get only OL but with class .article it also gets UL.
				'.article'	: [ 'ul' ]
		  	}
		},
	 	\"com.gentics.aloha.plugins.Link\": {
		 	// all elements with no specific configuration may insert links
			config : [ 'a' ],
		  	editables : {
				// No links in the title.
				'#title'	: [  ]
		  	},
		  	// all links that match the targetregex will get set the target
 			// e.g. ^(?!.*aloha-editor.com).* matches all href except aloha-editor.com
		  	targetregex : '^(?!.*aloha-editor.com).*',
		  	// this target is set when either targetregex matches or not set
		    // e.g. _blank opens all links in new window
		  	target : '_blank',
		  	// the same for css class as for target
		  	cssclassregex : '^(?!.*aloha-editor.com).*',
		  	cssclass : 'aloha',
		  	// use all resources of type website for autosuggest
		  	objectTypeFilter: ['website'],
		  	// handle change of href
		  	onHrefChange: function( obj, href, item ) {
			  	if ( item ) {
					jQuery(obj).attr('data-name', item.name);
			  	} else {
					jQuery(obj).removeAttr('data-name');
			  	}
		  	}
		},
	 	\"com.gentics.aloha.plugins.Table\": { 
		 	// all elements with no specific configuration are not allowed to insert tables
			config : [ ],
		  	editables : {
				// Allow insert tables only into .article
				'.article'	: [ 'table' ] 
		  	}
		},
		\"com.gentics.aloha.plugins.Annotations\": {
		    \"Services\" : {
		        \"fise\" : {
		            ApiEndpoint: '".variable_get('fise_api_endpoint', 'http://stanbol.iksfordrupal.net:9000/engines/')."'
		        },
		        \"zemanta\" : {
		            ApiEndpoint: 'http://api.zemanta.com/services/rest/0.0/',
		            ApiKey: '".variable_get('zemanta_api_key', false)."',
		            ApiMethod: 'zemanta.suggest_markup'
		        }
		    }
		}

	}
};

jQuery(document).ready(function () { 

/* Check if base DIR is set through configuration otherwise set to default */

	if (typeof GENTICS_Aloha_base == \"undefined\") {
		GENTICS_Aloha_base = Drupal.settings.basePath + \"sites/all/libraries/alohaeditor/\";
	}
	
});
	",
    array('type' => 'inline', 'scope' => 'header', 'weight' => 5)
    );

  $editor['alohaeditor'] = array(
    'title' => 'Aloha Editor',
    'vendor url' => 'http://www.aloha-editor.com/',
    'download url' => 'https://github.com/alohaeditor/Aloha-Editor',
    'library path' => wysiwyg_get_path('alohaeditor'),
    'libraries' => array(
      'min' => array(
        'title' => 'Minified',
        'files' => array('aloha.js',
        					'aloha-extras.js',
        					// default plugins
        					'plugins/com.gentics.aloha.plugins.Format/plugin.js',
        					'plugins/com.gentics.aloha.plugins.List/plugin.js',
        					'plugins/com.gentics.aloha.plugins.Table/plugin.js',
        					// extra plugins
        					'plugins/com.gentics.aloha.plugins.HighlightEditables/plugin.js',
        					'plugins/com.gentics.aloha.plugins.TOC/plugin.js',
        					// link plugin
        					'plugins/com.gentics.aloha.plugins.Link/plugin.js',
        					'plugins/com.gentics.aloha.plugins.Link/LinkList.js',
        					//'plugins/com.gentics.aloha.plugins.Link/delicious.js',
        					// paste plugin
        					'plugins/com.gentics.aloha.plugins.Paste/plugin.js',
        					'plugins/com.gentics.aloha.plugins.Paste/wordpastehandler.js',
        					//'plugins/com.gentics.aloha.plugins.Paste/___pastehandler.js',
        					// drupal plugin
        					'plugins/org.drupal.aloha.plugins.Drupal/plugin.js',
        					'plugins/org.drupal.aloha.plugins.Drupal/link-repository.js',
        					'plugins/org.drupal.aloha.plugins.Drupal/module-api-active_tags.js',
        					//'plugins/org.drupal.aloha.plugins.Drupal/module-api-wysiwyg.js',
        					//'plugins/org.drupal.aloha.plugins.Drupal/module-api-rdf.js',
        					// semantic annotations plugin
        					'plugins/com.gentics.aloha.plugins.Annotations/plugin.js',
        					'plugins/com.gentics.aloha.plugins.Annotations/lib/annotationservicemanager.js',
        					'plugins/com.gentics.aloha.plugins.Annotations/lib/annotationservice.js',
        					'plugins/com.gentics.aloha.plugins.Annotations/lib/annotationwritermanager.js',
        					'plugins/com.gentics.aloha.plugins.Annotations/lib/annotationwriter.js',
        					// semantic services
        					//'plugins/com.gentics.aloha.plugins.Annotations/service/zemanta.js',
        					'plugins/com.gentics.aloha.plugins.Annotations/service/fise.js',
        					),
      ),
      /*'pack' => array(
        'title' => 'Packed',
        'files' => array(),
      ),
      'src' => array(
        'title' => 'Source',
        'files' => array(''),
      ),*/
    ),
    'version callback' => 'wysiwyg_alohaeditor_version',
    'themes callback' => 'wysiwyg_alohaeditor_themes',
    'settings callback' => 'wysiwyg_alohaeditor_settings',
    'plugin callback' => 'wysiwyg_alohaeditor_plugins',
    'versions' => array(
      'nightly' => array(
        'js files' => array('alohaeditor.js'),
      ),
    ),
  );
  return $editor;
}

/**
 * Detect editor version.
 *
 * @param $editor
 *   An array containing editor properties as returned from hook_editor().
 *
 * @return
 *   The installed editor version.
 */
function wysiwyg_alohaeditor_version($editor) {
  $script = $editor['library path'] . '/VERSION.txt';
  if (!file_exists($script)) {
    return;
  }
  $script = fopen($script, 'r');
  fgets($script);
  $line = fgets($script);
  if (preg_match('([0-9a-zA-Z\.-]+)', $line, $version)) {
    fclose($script);
    return $version[0];
  }
  fclose($script);
}

/**
 * Determine available editor themes or check/reset a given one.
 *
 * @param $editor
 *   A processed hook_editor() array of editor properties.
 * @param $profile
 *   A wysiwyg editor profile.
 *
 * @return
 *   An array of theme names. The first returned name should be the default
 *   theme name.
 */
function wysiwyg_alohaeditor_themes($editor, $profile) {
  return array('default');
}

/**
 * Return runtime editor settings for a given wysiwyg profile.
 *
 * @param $editor
 *   A processed hook_editor() array of editor properties.
 * @param $config
 *   An array containing wysiwyg editor profile settings.
 * @param $theme
 *   The name of a theme/GUI/skin to use.
 *
 * @return
 *   A settings array to be populated in
 *   Drupal.settings.wysiwyg.configs.{editor}
 */
function wysiwyg_alohaeditor_settings($editor, $config, $theme) {
  // @todo Setup $library in wysiwyg_load_editor() already.
  $library = (isset($editor['library']) ? $editor['library'] : key($editor['libraries']));
  $settings = array(
    'basePath' => base_path() . $editor['library path'] . '/',
    //'wymPath' => $editor['libraries'][$library]['files'][0],
    // @todo Does not work in Drupal; jQuery can live anywhere.
    'jQueryPath' => base_path() . 'misc/jquery.js',
    'updateSelector' => '.form-submit',
    'skin' => $theme,
  );

  if (isset($config['language'])) {
    $settings['lang'] = $config['language'];
  }

  // Add configured buttons.
  $settings['toolsItems'] = array();
  if (!empty($config['buttons'])) {
    $buttoninfo = _wysiwyg_alohaeditor_button_info();
    $plugins = wysiwyg_get_plugins($editor['name']);
    foreach ($config['buttons'] as $plugin => $buttons) {
      foreach ($buttons as $button => $enabled) {
        // Iterate separately over buttons and extensions properties.
        foreach (array('buttons', 'extensions') as $type) {
          // Skip unavailable plugins.
          if (!isset($plugins[$plugin][$type][$button])) {
            continue;
          }
          // Add buttons.
          if ($type == 'buttons') {
            // Merge meta-data for internal default buttons.
            if (isset($buttoninfo[$button])) {
              //$buttoninfo[$button] += array('name' => $button);
              //$settings['toolsItems'][] = $buttoninfo[$button];
            }
            // For custom buttons, try to provide a valid button definition.
            else {
              /*$settings['toolsItems'][] = array(
                'name' => $button,
                'title' => $plugins[$plugin][$type][$button],
                'css' => 'wym_tools_' . $button,
              );*/
            }
          }
        }
      }
    }
  }

  if (!empty($config['block_formats'])) {
    $containers = array(
      'p' => 'Paragraph',
      'h1' => 'Heading_1',
      'h2' => 'Heading_2',
      'h3' => 'Heading_3',
      'h4' => 'Heading_4',
      'h5' => 'Heading_5',
      'h6' => 'Heading_6',
      'pre' => 'Preformatted',
      'blockquote' => 'Blockquote',
      'th' => 'Table_Header',
    );
    foreach (explode(',', $config['block_formats']) as $tag) {
      if (isset($containers[$tag])) {
        // @todo
        /*$settings['containersItems'][] = array(
          'name' => strtoupper($tag),
          'title' => $containers[$tag],
          'css' => 'xy_' . $tag,
        );*/
      }
    }
  }

  if (isset($config['css_setting'])) {
    if ($config['css_setting'] == 'theme') {
      // @todo
      //$settings['stylesheet'] = reset(wysiwyg_get_css());
    }
    else if ($config['css_setting'] == 'self' && isset($config['css_path'])) {
      $settings['stylesheet'] = strtr($config['css_path'], array('%b' => base_path(), '%t' => path_to_theme()));
    }
  }

  return $settings;
}

/**
 * Return internal plugins for this editor; semi-implementation of hook_wysiwyg_plugin().
 */
function wysiwyg_alohaeditor_plugins($editor) {
  $plugins = array(
    'default' => array(
      'buttons' => array(
        // @todo
        /*
        'Bold' => t('Bold'), 'Italic' => t('Italic'),
		'InsertOrderedList' => t('Bullet list'), 'InsertUnorderedList' => t('Numbered list'),
        'Outdent' => t('Outdent'), 'Indent' => t('Indent'),
        'Undo' => t('Undo'), 'Redo' => t('Redo'),
        'CreateLink' => t('Link'), 'Unlink' => t('Unlink'),
        'InsertImage' => t('Image'),
        'Superscript' => t('Superscript'), 'Subscript' => t('Subscript'),
        'ToggleHtml' => t('Source code'),
        'Paste' => t('Paste'),
        'InsertTable' => t('Table'),
        'Preview' => t('Preview'),*/
      ),
      'internal' => TRUE,
    ),
  );
  return $plugins;
}

/**
 * Helper function to provide additional meta-data for internal default buttons.
 */
function _wysiwyg_alohaeditor_button_info() {
  return array(
     // @todo
        /*'Bold' => array('title'=> 'Strong', 'css'=> 'wym_tools_strong'),
        'Italic' => array('title'=> 'Emphasis', 'css'=> 'wym_tools_emphasis'),
    'Superscript' => array('title'=> 'Superscript', 'css'=> 'wym_tools_superscript'),
    'Subscript' => array('title'=> 'Subscript', 'css'=> 'wym_tools_subscript'),
    'InsertOrderedList' => array('title'=> 'Ordered_List', 'css'=> 'wym_tools_ordered_list'),
    'InsertUnorderedList' => array('title'=> 'Unordered_List', 'css'=> 'wym_tools_unordered_list'),
    'Indent' => array('title'=> 'Indent', 'css'=> 'wym_tools_indent'),
    'Outdent' => array('title'=> 'Outdent', 'css'=> 'wym_tools_outdent'),
    'Undo' => array('title'=> 'Undo', 'css'=> 'wym_tools_undo'),
    'Redo' => array('title'=> 'Redo', 'css'=> 'wym_tools_redo'),
    'CreateLink' => array('title'=> 'Link', 'css'=> 'wym_tools_link'),
    'Unlink' => array('title'=> 'Unlink', 'css'=> 'wym_tools_unlink'),
    'InsertImage' => array('title'=> 'Image', 'css'=> 'wym_tools_image'),
    'InsertTable' => array('title'=> 'Table', 'css'=> 'wym_tools_table'),
    'Paste' => array('title'=> 'Paste_From_Word', 'css'=> 'wym_tools_paste'),
    'ToggleHtml' => array('title'=> 'HTML', 'css'=> 'wym_tools_html'),
    'Preview' => array('title'=> 'Preview', 'css'=> 'wym_tools_preview'),
    */
  );
}
