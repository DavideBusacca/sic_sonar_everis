// We define a variable holding the current key to visualize on the map.
var currentKey = 'tot';

// We specify the dimensions for the map container. We use the same
// width and height as specified in the CSS above.
var width = 1000,
    height = 1000;

// We create a SVG element in the map container and give it some
// dimensions.
var svg = d3.select('#map').append('svg')
  .attr('width', width)
  .attr('height', height);

// We add a <g> element to the SVG element and give it a class to
// style. We also add a class name for Colorbrewer.
var mapFeatures = svg.append('g')
  //.append('div')
  .attr('class', 'features YlGnBu');


// We add a <div> container for the tooltip, which is hidden by default.
var tooltip = d3.select("#map")
  .append("div")
  .attr("class", "tooltip hidden");

// Define the zoom and attach it to the map
/*var zoom = d3.behavior.zoom()
  .scaleExtent([1, 10])
  .on('zoom', doZoom);
svg.call(zoom);*/

// We define a geographical projection
//     https://github.com/mbostock/d3/wiki/Geo-Projections
// and set some dummy initial scale. The correct scale, center and
// translate parameters will be set once the features are loaded.
var projection = d3.geo.mercator()
  .scale(1);

// We prepare a path object and apply the projection to it.
var path = d3.geo.path()
  .projection(projection);

// We prepare an object to later have easier access to the data.
var dataById = d3.map();

// We prepare a quantize scale to categorize the values in 9 groups.
// The scale returns text values which can be used for the color CSS
// classes (q0-9, q1-9 ... q8-9). The domain will be defined once the
// values are known.
var quantize = d3.scale.quantize()
  .range(d3.range(9).map(function(i) { return 'q' + i + '-9'; }));

// Load the features from the GeoJSON.
d3.json('bcn-geodata_1/barris/barris_geo.json', function(error, features) {

  // Get the scale and center parameters from the features.
  var scaleCenter = calculateScaleCenter(features);

  // Apply scale, center and translate parameters.
  projection.scale(scaleCenter.scale)
    .center(scaleCenter.center)
    .translate([width/2, height/2]);

    svg.append("g")
        .selectAll("labels")
        .data(features.features)
        .enter()
        .append("text")
          .attr("x", function(d){return path.centroid(d)[0]})
          .attr("y", function(d){return path.centroid(d)[1]})
          .text(function(d){ return d.properties.C_Barri})
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "central")
          .attr("class","noselect")
          .style("font-size", 11)


        // .text(function(d){ return d.properties.Homes+d.properties.Dones})

          svg.append("g")
              .selectAll("rects")
              .data(features.features)
              .enter()
    .append('rect')
    .attr("x", function(d){return path.centroid(d)[0]-get_sqrt(d)/2})
    .attr("y", function(d){return path.centroid(d)[1]-get_sqrt(d)/2})
    .attr("width", function(d){ return get_sqrt(d)})
    .attr("height", function(d){ return get_sqrt(d)})
    .attr("fill",'none')
    .attr("opacity",0.5)
    .attr("stroke",'black')
    .attr("class","noselect")

  // Read the data for the cartogram
  d3.csv('data/barris_geo1.csv', function(data) {

    // This maps the data of the CSV so it can be easily accessed by
    // the ID of the municipality, for example: dataById[2196]
    dataById = d3.nest()
      .key(function(d) { return d.C_Barri; })
      .rollup(function(d) { return d[0]; })
      .map(data);

    // Set the domain of the values (the minimum and maximum values of
    // all values of the current key) to the quantize scale.
    quantize.domain([
      d3.min(data, function(d) { return getValueOfData(d); }),
      d3.max(data, function(d) { return getValueOfData(d); })+20000
    ]);

    // We add the features to the <g> element created before.
    // D3 wants us to select the (non-existing) path objects first ...
    mapFeatures.selectAll('path')
        // ... and then enter the data. For each feature, a <path>
        // element is added.
        .data(features.features)
        .enter()
        //.append('div')
        //.attr('id','yo')
        .append('path')
        .attr('id',function(d){return 'barri_'+getIdOfFeature(d)})
        .attr('class', function(d) {
          // Use the quantized value for the class
          return quantize(getValueOfData(dataById[getIdOfFeature(d)]));
        })
        // As "d" attribute, we set the path of the feature.
        .attr('d', path)
        // When the mouse moves over a feature, show the tooltip.
        .on('mousemove', showTooltip)
        .on("mousedown", function(d,i) {chickenWrapper(d, i) });  // "click"

  });

});

/**
 * Show a tooltip with the name of the feature.
 *
 * @param {object} f - A GeoJSON Feature object.
 */
function showTooltip(f) {
  // Get the ID of the feature.
  //var id = getIdOfFeature(f);
  // Use the ID to get the data entry.
  //var d = dataById[id];
  // Show the tooltip (unhide it) and set the name of the data entry.
  tooltip.classed('hidden', false)
    //.html(d.tot);
    .html(f.properties.N_Barri)
}

/**
 * Zoom the features on the map. This rescales the features on the map.
 * Keep the stroke width proportional when zooming in.
 */
function doZoom() {
  mapFeatures.attr("transform",
    "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")")
    // Keep the stroke width proportional. The initial stroke width
    // (0.5) must match the one set in the CSS.
    .style("stroke-width", 0.5 / d3.event.scale + "px");
}

function get_sqrt(d){
  return Math.sqrt(d.properties.Homes+d.properties.Dones)/3
  //return Math.sqrt(d.properties.Area)/25
}

/**
 * Calculate the scale factor and the center coordinates of a GeoJSON
 * FeatureCollection. For the calculation, the height and width of the
 * map container is needed.
 *
 * Thanks to: http://stackoverflow.com/a/17067379/841644
 *
 * @param {object} features - A GeoJSON FeatureCollection object
 *   containing a list of features.
 *
 * @return {object} An object containing the following attributes:
 *   - scale: The calculated scale factor.
 *   - center: A list of two coordinates marking the center.
 */
function calculateScaleCenter(features) {
  // Get the bounding box of the paths (in pixels!) and calculate a
  // scale factor based on the size of the bounding box and the map
  // size.
  var bbox_path = path.bounds(features),
      scale = 0.95 / Math.max(
        (bbox_path[1][0] - bbox_path[0][0]) / width,
        (bbox_path[1][1] - bbox_path[0][1]) / height
      );

  // Get the bounding box of the features (in map units!) and use it
  // to calculate the center of the features.
  var bbox_feature = d3.geo.bounds(features),
      center = [
        (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
        (bbox_feature[1][1] + bbox_feature[0][1]) / 2];

  return {
    'scale': scale,
    'center': center
  };
}

/**
 * Helper function to access the (current) value of a data object.
 *
 * Use "+" to convert text values to numbers.
 *
 * @param {object} d - A data object representing an entry (one line) of
 * the data CSV.
 */
function getValueOfData(d) {
  return +d[currentKey];
}

/**
 * Helper function to retrieve the ID of a feature. The ID is found in
 * the properties of the feature.
 *
 * @param {object} f - A GeoJSON Feature object.
 */
function getIdOfFeature(f) {
  return f.properties.C_Barri;
}
