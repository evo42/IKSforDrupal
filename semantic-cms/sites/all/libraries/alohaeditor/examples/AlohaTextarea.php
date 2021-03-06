<?
	# Stripslashes with support for Arrays
	function stripslashes_deep ( $value ) {
		// Originally from BalPHP {@link http://www.balupton/projects/balphp}
		// Authorised by Benjamin Arthur Lupton {@link http://www.balupton.com/} (the copyright holder)
		// for use and license under the Aloha Editor Contributors Agreement
		$value = is_array($value) ? array_map('stripslashes_deep', $value) : stripslashes($value);
		return $value;
	}
	
	# Normalises Magic Quotes
	function fix_magic_quotes ( ) {
		// Originally from BalPHP {@link http://www.balupton/projects/balphp}
		// Authorised by Benjamin Arthur Lupton {@link http://www.balupton.com/} (the copyright holder)
		// for use and license under the Aloha Editor Contributors Agreement
		if ( ini_get('magic_quotes_gpc') ) {
			$_POST = array_map('stripslashes_deep', $_POST);
			$_GET = array_map('stripslashes_deep', $_GET);
			$_COOKIE = array_map('stripslashes_deep', $_COOKIE);
			$_REQUEST = array_map('stripslashes_deep', $_REQUEST);
			ini_set('magic_quotes_gpc', 0);
		}
	}
	
	# Fix the magic quotes
	fix_magic_quotes();
	
?><!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>
			Aloha, Documents!
		</title>
		
		<script type="text/javascript">
			GENTICS_Aloha_base="../";
		</script>
		<script type="text/javascript" src="../core/include.js"></script>
		<script type="text/javascript" src="../plugins/com.gentics.aloha.plugins.Format/plugin.js"></script>
		<!-- script type="text/javascript" src="../plugins/com.gentics.aloha.plugins.Table/plugin.js"></script -->
		<script type="text/javascript" src="../plugins/com.gentics.aloha.plugins.List/plugin.js"></script>
		<script type="text/javascript" src="../plugins/com.gentics.aloha.plugins.Link/plugin.js"></script>
		<link rel="stylesheet" href="AlohaDocument.css" type="text/css">
		
		<!-- turn an element into editable Aloha continuous text -->
		<script type="text/javascript">
			GENTICS.Aloha.settings = {
				logLevels: {'error': true, 'warn': true, 'info': true, 'debug': true},
				errorhandling: false,
				ribbon: false
			};
			$(function(){
//				$('#content').aloha();
			}); 
		</script>
		<style>
textarea {
	width:100%;
	height:500px;
}
		</style>
	</head>
	<body>
		<div id="main">
			<div id="bodyContent">
				<form id="form" method="POST" action="">
					<textarea id="content" class="article" name="content">
<? 
if ( !empty($_POST['content']) ) :
   echo $_POST['content'];
else:
?>
<h1>Aloha</h1>
<h2>Etymology</h2>
<p>
	The word <a href="http://en.wikipedia.org/wiki/Aloha" target="_blank" class="external">aloha</a> derives from the Proto-Polynesian root <i>*qalofa</i>. It has cognates in other Polynesian languages, such as Samoan alofa and Māori aroha, also meaning "love."
</p>
<p>
	<a href="http://aloha-editor.com/">Aloha Editor</a> is the word's most advanced browser based Editor made with aloha passion.
</p>
<ul>
	<li>Arguably the most famous historical Hawaiian song, "Aloha ʻOe" was written by the last queen of Hawaii, Liliʻuokalani.
	</li>
	<li>The term inspired the name of the ALOHA Protocol introduced in the 1970s by the University of Hawaii.
	</li>
	<li>In Hawaii someone can be said to have or show aloha in the way they treat others; whether family, friend, neighbor or stranger.
	</li>
</ul>
<? endif; ?>
					</textarea>
					<hr />
					<input type="submit" value="Send to backend"/>
					<button id="aloha" type="button">aloha</button>
					<button id="mahalo" type="button">mahalo</button>
					<button id="getContents" type="button">getContents</button>
				</form>
			</div>
		</div>
		<script type="text/javascript">
			$('#mahalo').hide();
			$('#getContents').hide();


			$('#aloha').click(function(){
				$('#content').aloha();
				$('#mahalo').show();
				$('#getContents').show();
				$(this).hide();
			}); 

			$('#mahalo').click(function(){
				$('#content').mahalo();
				$('#aloha').show();
				$('#getContents').hide();
				$(this).hide();
			}); 

			$('#getContents').click(function(){
				var e = GENTICS.Aloha.getEditableById('content');
				alert(e.getContents());
			}); 
		</script>
	</body>
</html>
