<?php

/*

demo server: http://fise.demo.nuxeo.com

FISE is able to serialize the response in the following RDF formats:

    * application/json (JSON-LD)
    * application/rdf+xml (RDF/XML)
    * application/rdf+json (RDF/JSON)
    * text/turtle (Turtle)
    * text/rdf+nt (N-TRIPLES)


curl -X POST -H "Accept: text/turtle" -H "Content-type: text/plain" \
     --data "Fise can detect famous cities such as Paris." \
     http://fise.demo.nuxeo.com/engines/


*/

?>