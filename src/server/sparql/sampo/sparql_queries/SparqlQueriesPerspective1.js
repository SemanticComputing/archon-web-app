const perspectiveID = 'perspective1'

export const ampullaeProperties = `
    {
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
      BIND(?id as ?uri__id)
      BIND(?id as ?uri__dataProviderUrl)
      BIND(?id as ?uri__prefLabel)
    }
    UNION
    {
      ?id archon:found_at_location/archon:situated_at ?parish__id .
      ?parish__id skos:prefLabel ?parish__prefLabel .
      #BIND(CONCAT("/manuscripts/page/", REPLACE(STR(?manuscript__id), "^.*\\\\/(.+)", "$1")) AS ?manuscript__dataProviderUrl)
      OPTIONAL {
        ?parish__id archon:situated_at ?county__id .
        ?county__id skos:prefLabel ?county__prefLabel .
      }
    }
    UNION
    {
      ?id archon:has_design_element/archon:has_visual_item ?visualElement__id .
      ?visualElement__id skos:prefLabel ?visualElement__prefLabel .
    }
    UNION
    {
      ?id crm:P43_has_dimension/crm:P2_has_type archon:Weight .
      ?id crm:P43_has_dimension/crm:P90_has_value ?weight .
    }
    UNION
    {
      ?id crm:P43_has_dimension/crm:P2_has_type archon:Length .
      ?id crm:P43_has_dimension/crm:P90_has_value ?length .
    }
    UNION
    {
      ?id crm:P43_has_dimension/crm:P2_has_type archon:Width .
      ?id crm:P43_has_dimension/crm:P90_has_value ?width .
    }
    UNION
    {
      ?id archon:description ?description .
    }
    UNION
    {
      ?id archon:has_image ?image__id .
      ?id archon:has_image ?image__url .
      ?id archon:has_image ?image__description .
    }
`


export const knowledgeGraphMetadataQuery = `
  SELECT * 
  WHERE {
    ?id a sd:Dataset ;
        dct:title ?title ;
        dct:publisher ?publisher ;
        dct:rightsHolder ?rightsHolder ;
        dct:modified ?modified ;
        dct:source ?databaseDump__id .
    ?databaseDump__id skos:prefLabel ?databaseDump__prefLabel ;
                      mmm-schema:data_provider_url ?databaseDump__dataProviderUrl ;
                      dct:modified ?databaseDump__modified .
  }
`

export const findsPlacesQuery = `
  SELECT DISTINCT ?id ?lat ?long ?markerColor
  (1 as ?instanceCount) # for heatmap
  WHERE {
    <FILTER>
    ?id archon:found_at_location/archon:has_coordinates/archon:lat_coordinates ?lat .
    ?id archon:found_at_location/archon:has_coordinates/archon:long_coordinates ?long .

    BIND("red" AS ?markerColor)

  }
`

export const findsByVisual = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?find) as ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?find a archon:Archaeological_object .
      ?find archon:has_design_element/archon:has_visual_item ?category .
      ?category skos:prefLabel ?prefLabel .
    }
    UNION
    {
      ?find a archon:Archaeological_object .
      FILTER NOT EXISTS {
        ?find archon:has_design_element/archon:has_visual_item [] .
      }
      BIND("Unknown" as ?category)
      BIND("Unknown " as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const findsByCounty = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?find) as ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?find a archon:Archaeological_object .
      ?find archon:found_at_location/archon:situated_at/archon:situated_at ?category .
      ?category skos:prefLabel ?prefLabel .
    }
    UNION
    {
      ?find a archon:Archaeological_object .
      FILTER NOT EXISTS {
        ?find archon:found_at_location/archon:situated_at/archon:situated_at [] .
      }
      BIND("Unknown" as ?category)
      BIND("Unknown " as ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`