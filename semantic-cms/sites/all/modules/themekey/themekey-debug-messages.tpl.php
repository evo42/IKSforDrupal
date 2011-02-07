<?php
// $Id: themekey-debug-messages.tpl.php,v 1.4.2.1 2010/10/16 17:22:46 mkalkbrenner Exp $

/**
 * @file
 * template to format ThemeKey Debug Messages
 */
?>
<table border="1" style="color:black;" bgcolor="white">
  <tr><th><?php print t('ThemeKey Debug Messages'); ?></th></tr>
  <?php foreach ($messages as $message) {?>
  <tr><td><?php print $message; ?></td></tr>
  <?php } ?>
</table>
