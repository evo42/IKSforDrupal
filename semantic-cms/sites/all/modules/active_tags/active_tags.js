// $Id: active_tags.js,v 1.1.2.29.2.1.2.4 2011/01/13 22:49:53 dragonwize Exp $

/**
 * @file
 * Changes taxonomy tags fields to Active Tags style widgets.
 */

(function ($) {

var activeTags = {};

activeTags.parseCsv = function (sep, string) {
  for (var result = string.split(sep = sep || ","), x = result.length - 1, tl; x >= 0; x--) {
    if (result[x].replace(/"\s+$/, '"').charAt(result[x].length - 1) == '"') {
      if ((tl = result[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        result[x] = result[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      }
      else if (x) {
        result.splice(x - 1, 2, [result[x - 1], result[x]].join(sep));
      }
      else {
        result = result.shift().split(sep).concat(result);
      }
    }
    else {
      result[x].replace(/""/g, '"');
    }
  }
  return result;
};

activeTags.checkEnter = function (event) {
  if (event.keyCode == 13) {
    $('#autocomplete').each(function () {
      this.owner.hidePopup();
    });
    $(this).parent().find('.at-add-btn').click();
    event.preventDefault();
    return false;
  }
};

activeTags.addTermOnSubmit = function () {
  $('.at-add-btn').click();
};

activeTags.addTerm = function (context, term) {
  //alert(term);
  // Hide the autocomplete drop down.
  $('#autocomplete').each(function () {
    this.owner.hidePopup();
  });

  // Removing all HTML tags. Need to wrap in tags for text() to work correctly.
  term = $('<div>' + term + '</div>').text();
  term = Drupal.checkPlain(term);
  term = jQuery.trim(term);

  if (term != '') {
    var termDiv = $(context);
    var termList = termDiv.parent().find('.at-term-list');
    termList.append(Drupal.theme('activeTagsTermRemove', term));
    // Attach behaviors to new DOM content.
    Drupal.attachBehaviors(termList);
    activeTags.updateFormValue(termList);
    termList.parent().find('.at-term-entry').val('');
  }

  return false;
};

activeTags.removeTerm = function (context) {
  var tag = $(context);
  var termList = tag.parent();
  tag.remove();
  // @todo add term to excludeTermList array
  activeTags.updateFormValue(termList);
};

activeTags.updateFormValue = function (termList) {
  var tags = '';
  termList.find('.at-term-text').each(function (i) {
    // Get tag and revome quotes to prevent doubling
    var tag = $(this).text().replace(/["]/g, '');
    // Wrap in quotes if tag contains a comma.
    if (tag.search(',') != -1) {
      tag = '"' + tag + '"';
    }
    // Collect tags as a comma seperated list.
    tags = (i == 0) ? tag : tags + ', ' + tag;
  });
  // Set comma seperated tags as value of form field.
  termList.parent().find('input.at-terms').val(tags);
};

/**
 * Theme a selected term.
 */
Drupal.theme.prototype.activeTagsTermRemove = function (term) {
  return '<div class="at-term at-term-remove"><span class="at-term-text">' + term + '</span><span class="at-term-action-remove">x</span></div> ';
};
/*
Drupal.behaviors.activeTagsAutocomplete = function (context) {
  $('li:not(.activeTagsAutocomplete-processed)', context)
    .addClass('activeTagsAutocomplete-processed')
    .each(function () {
      var li = this;
      $(li).focus(function () {
        $('#autocomplete').each(function () {
          this.owner.input.value = $(li).text();
        });
      }).mousedown(function () {
        $('input.add-tag').click();
        $('input.add-tag').prev().val('');
      });
  });
}
*/

Drupal.behaviors.activeTagsOnEnter = {
  attach: function (context, settings) {
    if ($.browser.mozilla) {
      $('.at-term-entry:not(.activeTagsOnEnter-processed)')
        .addClass('activeTagsOnEnter-processed')
        .keypress(activeTags.checkEnter);
    }
    else {
      $('.at-term-entry:not(.activeTagsOnEnter-processed)')
        .addClass('activeTagsOnEnter-processed')
        .keydown(activeTags.checkEnter);
    }
  }
};

Drupal.behaviors.activeTagsRemove = {
  attach: function (context, settings) {
    $('div.at-term-remove:not(.activeTagsRemove-processed)', context)
      .addClass('activeTagsRemove-processed')
      .each(function () {
        $(this).click(function () {
          activeTags.removeTerm(this);
        })
      });
  }
};

Drupal.behaviors.activeTagsAdd = {
  attach: function (context, settings) {
    $('input.at-add-btn:not(.activeTagsAdd-processed)', context)
      .addClass('activeTagsAdd-processed')
      .each(function () {
        $(this).click(function (e) {
          var tag = $(this).parent().find('.at-term-entry').val().replace(/["]/g, '');
          activeTags.addTerm(this, tag);
          return false;
        });
      });
  }
};

Drupal.behaviors.activeTagsApi = {
  /*function (context, settings) {
    $('input.at-add-btn:not(.activeTagsAdd-processed)', context)
      .addClass('activeTagsAdd-processed')
      .each(function () {
        $(this).click(function (e) {
          var tag = $(this).parent().find('.at-term-entry').val().replace(/["]/g, '');
          activeTags.addTerm(this, tag);
          return false;
        });
      });
  }*/
  /*function (context, settings) {
  activeTags.addTerm('#edit-field-tags', 'auto tag');
  }*/
  attach: function (context, settings) {
  }
};


$(window).load(function () {
  // Setup tags to be added on form submit.
  $('#node-form').submit(activeTags.addTagOnSubmit);
  //activeTags.addTerm('#edit-field-tags', 'auto tag');
});

})(jQuery);
