(function(a){var f=a.uri("http://xmlns.com/foaf/0.1/"),k=a.rdf.resource("<"+a.uri.base()+">"),g=a.rdf.resource("<"+f+"Person>"),l=a.rdf.resource("<"+f+"knows>"),i=a.rdf.resource("<"+f+"weblog>"),h=a.rdf.blank("[]"),m=/(?:^|\s)me(?:\s|$)/,j=function(b){var e=this.attr("rel"),c=this.attr("href");e=m.exec(e);var d=a.rdf.blank("[]");if(c!==undefined&&e===null)return b&&b.about!==undefined?b.about===null?true:b.about===a.uri.base()||b.about===c:b&&b.type!==undefined?b.type===null?true:b.type===g.uri:[a.rdf.triple(h,
a.rdf.type,g),a.rdf.triple(h,i,k),a.rdf.triple(h,l,d),a.rdf.triple(d,i,"<"+c+">"),a.rdf.triple(d,a.rdf.type,g)];return b===undefined?[]:false};a.fn.xfn=function(b){if(b===undefined){var e=a.map(a(this),function(c){return j.call(a(c))});return a.rdf({triples:e})}else{a(this).filter("[href]").each(function(){var c=a(this),d=c.attr("rel");if(d===undefined||d==="")c.attr("rel",b);else d.toLowerCase().match(b.toLowerCase())||c.attr("rel",d+" "+b)});return this}};a.rdf.gleaners.push(j)})(jQuery);
