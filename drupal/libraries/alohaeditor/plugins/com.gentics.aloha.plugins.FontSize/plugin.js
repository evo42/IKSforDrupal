GENTICS.Aloha.FontSize=new GENTICS.Aloha.Plugin("com.gentics.aloha.plugins.FontSize");GENTICS.Aloha.FontSize.languages=["en"];
GENTICS.Aloha.FontSize.init=function(){var d=[],e=["increase","decrease"],a=GENTICS_Aloha_base+"/plugins/com.gentics.aloha.plugins.FontSize/css/FontSize.css";jQuery('<link rel="stylesheet" />').attr("href",a).appendTo("head");jQuery.each(e,function(h,i){d.push(new GENTICS.Aloha.ui.Button({iconClass:"GENTICS_button_"+i,size:"small",onclick:function(){GENTICS.Aloha.activeEditable&&GENTICS.Aloha.activeEditable.obj[0].focus();var f,g=jQuery("<span></span>"),b=GENTICS.Aloha.Selection.rangeObject,c=b.findMarkup(function(){return this.nodeName.toLowerCase()==
g.get(0).nodeName.toLowerCase()},GENTICS.Aloha.activeEditable.obj);if(c){f=parseInt(jQuery(c).css("font-size"))+(h===0?1:-1)+"px";jQuery(c).css("font-size",f)}else GENTICS.Utils.Dom.addMarkup(b,g);b.select();return false}}))});for(a=0;a<e.length;a++)GENTICS.Aloha.FloatingMenu.addButton("GENTICS.Aloha.continuoustext",d[a],this.i18n("floatingmenu.tab.format"),1)};