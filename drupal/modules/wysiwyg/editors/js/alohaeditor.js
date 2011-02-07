(function($) {

/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.alohaeditor = function(context, params, settings) {
  // Attach editor.
  $('#' + params.field).aloha();
};

/**
 * Detach a single or all editors.
 */
Drupal.wysiwyg.editor.detach.alohaeditor = function(context, params) {
  var editor = $('#' + params.field);
  if (typeof editor != 'undefined') {
    editor.mahalo();
  }
  editor.show();
};

})(jQuery);