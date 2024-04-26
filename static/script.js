const graph1_dropdown1_options_arr = ["anxiety", "depression", "insomnia", "ocd"];
let graph1_data;
colorScale = d3.scale.category10();
function mds_rows_plot(num_clusters) {
    $.get('/mds_row_data/' + num_clusters, function(data) {
        // Render scatter plot using D3.js
        d3.select("#mds_row_plot").selectAll("*").remove();
        const margin = { top: 50, right: 50, bottom: 80, left: 50 };
        const width = 500 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select('#mds_row_plot').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // Set up scales
        const xScale = d3.scale.linear()
            .domain(d3.extent(data, function(d) { return d.x; }))
            .range([0, width])
            .nice();

        const yScale = d3.scale.linear()
            .domain(d3.extent(data, function(d) { return d.y; }))
            .range([height, 0])
            .nice();

        // Define color scale for clusters
        //const colorScale = d3.scale.category10();

        // Draw points
        svg.selectAll('circle')
            .data(data)
            .enter().append('circle')
            .attr('cx', function(d) { return xScale(d.x); })
            .attr('cy', function(d) { return yScale(d.y); })
            .attr('r', 5)
            .style('fill', function(d) { return colorScale(d.cluster); });

        // Axes labels
        svg.append('text')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height + margin.top + 10) + ')')
            .style('text-anchor', 'middle')
            .text('Dimension 1');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Dimension 2');

        // Draw x-axis
//        svg.append('g')
//            .attr('transform', 'translate(0,' + height + ')')
//            .call(d3.svg.axis().scale(xScale).orient('bottom'));
svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.svg.axis().scale(xScale).orient('bottom'))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');

        // Draw y-axis
        svg.append('g')
            .call(d3.svg.axis().scale(yScale).orient('left'));

        // Plot title
        svg.append('text')
            .attr('x', (width / 2))
            .attr('y', 0 - (margin.top / 2))
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .text('MDS Data Plot');

        // Legend
        const legend = svg.selectAll('.legend')
            .data(colorScale.domain())
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')'; });

        legend.append('rect')
            .attr('x', width - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', colorScale);

        legend.append('text')
            .attr('x', width - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            //.attr('transform', 'rotate(-45)')
            .text(function(d) { return 'Cluster ' + d; });
    });
}

function plotRadarPlot() {
  d3.select("#radarplot").selectAll("*").remove();

  // Make a GET request to fetch data from the API
  $.get('/radar_plot', function(data) {
    var radarData = [];
    var genres = [];

    // Extracting data
    data.forEach(function(d) {
      var genre = d.fav_genre;
      genres.push(genre);
      radarData.push([
        {axis: "Anxiety", value: d.anxiety},
        {axis: "Depression", value: d.depression},
        {axis: "Insomnia", value: d.insomnia},
        {axis: "OCD", value: d.ocd}
      ]);
    });

    // Radar chart configuration
    var margin = {top: 50, right: 100, bottom: 50, left: 50},
        width = Math.min(500, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(400, window.innerHeight - margin.top - margin.bottom - 20);

    var color = d3.scale.ordinal()
      .range(["#EDC951","#CC333F","#00A0B0"]);

    var radarChartOptions = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 0,
      levels: 0,
      roundStrokes: true,
      color: color
    };

    // Call radar chart function
    RadarChart("#radarplot", radarData, genres, radarChartOptions);
  });
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function RadarChart(id, data, genres, options) {
  var cfg = {
    w: 600,				// Width of the circle
    h: 600,				// Height of the circle
    margin: {top: 20, right: 20, bottom: 20, left: 20}, // The margins of the SVG
    levels: 3,				// How many levels or inner circles should there be drawn
    maxValue: 0, 			// What is the value that the biggest circle will represent
    labelFactor: 1.25, 	// How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, 		// The number of pixels after which a label needs to be given a new line
    opacityArea: 0.05, 	// The opacity of the area of the blob
    dotRadius: 4, 			// The size of the colored circles of each blog
    opacityCircles: 0.1, 	// The opacity of the circles of each blob
    strokeWidth: 2, 		// The width of the stroke around each blob
    roundStrokes: false,	// If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scale.category10(),	// Color function
    axisFontSize: "11px",  // Font size for axis labels
    tooltipFontSize: "12px" // Font size for tooltip
  };

  // Put all of the options into a variable called cfg
  if('undefined' !== typeof options){
    for(var i in options){
      if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
    }
  }

  // Calculate the maxValue if not provided
  if(cfg.maxValue === 0) {
    cfg.maxValue = Math.ceil(d3.max(data.map(function(d) {
      return d3.max(d.map(function(o) {
        return o.value;
      }));
    })));
  }

  var allAxis = data[0].map(function(d) { return d.axis; }), // Names of each axis
      total = allAxis.length,					// The number of different axes
      radius = Math.min(cfg.w/2, cfg.h/2), 	// Radius of the outermost circle
      angleSlice = Math.PI * 2 / total;		// The width in radians of each "slice"

  // Scale for the radius
  var rScale = d3.scale.linear()
    .range([0, radius])
    .domain([0, cfg.maxValue]);

  // Create the container SVG and g
  var svg = d3.select(id).append("svg")
      .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
      .attr("class", "radar"+id);
  var g = svg.append("g")
      .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

  // Draw the Circular grid
  var axisGrid = g.append("g").attr("class", "axisWrapper");

  // Calculate the number of levels dynamically based on maxValue
  var numLevels = cfg.maxValue;

  // Draw the background circles
  axisGrid.selectAll(".levels")
     .data(d3.range(1, numLevels + 1).reverse())
     .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function(d) { return (radius / cfg.maxValue) * d; }) // Adjusted calculation
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles);

  // Text indicating at what value each level is
  axisGrid.selectAll(".axisLabel")
     .data(d3.range(1, numLevels + 1).reverse())
     .enter().append("text")
     .attr("class", "axisLabel")
     .attr("x", 4)
     .attr("y", function(d) { return -d * radius / numLevels; })
     .attr("dy", "0.4em")
     .style("font-size", cfg.axisFontSize)
     .attr("fill", "#737373")
     .text(function(d) { return Math.round(cfg.maxValue * d / numLevels); });

  // Draw the axes
  var axis = axisGrid.selectAll(".axis")
      .data(allAxis)
      .enter()
    .append("g")
      .attr("class", "axis");

  // Append the lines
  axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function(d, i) { return rScale(cfg.maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI/2); })
      .attr("y2", function(d, i) { return rScale(cfg.maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI/2); })
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

  // Append the labels at each axis
  axis.append("text")
      .attr("class", "legend")
      .style("font-size", cfg.axisFontSize)
      .attr("text-anchor", function(d, i) {
          if (i === 0 || i === total / 2) return "middle"; // For top and bottom labels
          else if (i < total / 2) return "start"; // For left labels
          else return "end"; // For right labels
      })
      .attr("dy", function(d, i) {
          if (i === 0) return "-0.5em"; // For top labels
          else if (i === total / 2) return "1em"; // For bottom labels
          else return "0.35em"; // For left and right labels
      })
      .attr("x", function(d, i) {
          if (i === 0 || i === total / 2) return 0; // For top and bottom labels
          else if (i < total / 2) return -rScale(cfg.maxValue * cfg.labelFactor); // For left labels
          else return rScale(cfg.maxValue * cfg.labelFactor); // For right labels
      })
      .attr("y", function(d, i) {
          if (i === 0) return -rScale(cfg.maxValue * cfg.labelFactor); // For top labels
          else if (i === total / 2) return rScale(cfg.maxValue * cfg.labelFactor); // For bottom labels
          else return 0; // For left and right labels
      })
      .text(function(d) { return d; });

  // The radial line function
  var radarLine = d3.svg.line.radial()
      .interpolate("linear-closed")
      .radius(function(d) { return rScale(d.value); })
      .angle(function(d,i) {	return i*angleSlice; });

  if(cfg.roundStrokes) {
    radarLine.interpolate("cardinal-closed");
  }

  // Create a wrapper for the blobs
  var blobWrapper = g.selectAll(".radarWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarWrapper");

//  // Append the backgrounds
//  blobWrapper
//      .append("path")
//      .attr("class", "radarArea")
//      .attr("d", function(d) { return radarLine(d); })
//      .style("fill", function(d, i) { return cfg.color(i); })
//      .style("fill-opacity", cfg.opacityArea)
//      .on('mouseover', function (d) {
//          // Dim all blobs
//          d3.selectAll(".radarArea")
//              .transition().duration(200)
//              .style("fill-opacity", cfg.opacityArea);
//          // Bring back the hovered over blob
//          d3.select(this)
//              .transition().duration(200)
//              .style("fill-opacity", 0.7);
//      })
//      .on('mouseout', function() {
//          // Bring back all blobs
//          d3.selectAll(".radarArea")
//              .transition().duration(200)
//              .style("fill-opacity", cfg.opacityArea);
//      });

  // Create the outlines
  blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", function(d) { return radarLine(d); })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", function(d, i) { return cfg.color(i); })
      .style("fill", "none")
      .style("filter" , "url(#glow)");

  // Append the circles
  blobWrapper.selectAll(".radarCircle")
      .data(function(d) { return d; })
      .enter().append("circle")
      .attr("class", "radarCircle")
      .attr("r", cfg.dotRadius)
      .attr("cx", function(d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI/2); })
      .attr("cy", function(d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI/2); })
      .style("fill", function(d, i, j) { return cfg.color(j); })
      .style("fill-opacity", 0.8);

  // Wrapper for the invisible circles on top
  var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarCircleWrapper");

  // Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll(".radarInvisibleCircle")
      .data(function(d) { return d; })
      .enter().append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", cfg.dotRadius * 1.5)
      .attr("cx", function(d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI/2); })
      .attr("cy", function(d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI/2); })
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function(d, i, j) {
          var newX = parseFloat(d3.select(this).attr("cx")) - 10;
          var newY = parseFloat(d3.select(this).attr("cy")) - 10;

          tooltip
              .attr("x", newX)
              .attr("y", newY)
              .text(`${genres[j]}: ${d.value}`) // Display genre and value
              .attr("font-size", cfg.tooltipFontSize)
              .transition().duration(200)
              .style("opacity", 0.9);
      })
      .on("mouseout", function() {
          tooltip.transition().duration(200)
              .style("opacity", 0);
      });

  // Set up the small tooltip for when you hover over a circle
  var tooltip = g.append("text")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // Append legend
  var legend = g.selectAll(".legend")
      .data(genres)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        var horz = cfg.w + 100;
        var vert = i * 20 - cfg.h / 2;
        return "translate(" + horz + "," + vert + ")";
      });

  legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d, i) {
        return cfg.color(i);
      });

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function(d) {
        return d;
      });
}

//function RadarChart(id, data, genres, options) {
//  var cfg = {
//    w: 600,				// Width of the circle
//    h: 600,				// Height of the circle
//    margin: {top: 20, right: 20, bottom: 20, left: 20}, // The margins of the SVG
//    levels: 3,				// How many levels or inner circles should there be drawn
//    maxValue: 0, 			// What is the value that the biggest circle will represent
//    labelFactor: 1.25, 	// How much farther than the radius of the outer circle should the labels be placed
//    wrapWidth: 60, 		// The number of pixels after which a label needs to be given a new line
//    opacityArea: 0.05, 	// The opacity of the area of the blob
//    dotRadius: 4, 			// The size of the colored circles of each blog
//    opacityCircles: 0.1, 	// The opacity of the circles of each blob
//    strokeWidth: 2, 		// The width of the stroke around each blob
//    roundStrokes: false,	// If true the area and stroke will follow a round path (cardinal-closed)
//    color: d3.scale.category10()	// Color function
//  };
//
//  // Put all of the options into a variable called cfg
//  if('undefined' !== typeof options){
//    for(var i in options){
//      if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
//    }
//  }
//
//  // If the supplied maxValue is smaller than the actual one, replace by the max in the data
//  var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
//
//  var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
//      total = allAxis.length,					//The number of different axes
//      radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
//      Format = d3.format('%'),			 	//Percentage formatting
//      angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
//
//  //Scale for the radius
//  var rScale = d3.scale.linear()
//    .range([0, radius])
//    .domain([0, maxValue]);
//
//  // Create the container SVG and g
//  var svg = d3.select(id).append("svg")
//      .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
//      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
//      .attr("class", "radar"+id);
//  var g = svg.append("g")
//      .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
//
//  //Filter for the outside glow
//  var filter = g.append('defs').append('filter').attr('id','glow'),
//      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
//      feMerge = filter.append('feMerge'),
//      feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
//      feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
//
//  // Draw the Circular grid
//  var axisGrid = g.append("g").attr("class", "axisWrapper");
//
//  //Draw the background circles
//  axisGrid.selectAll(".levels")
//     .data(d3.range(1,(cfg.levels+1)).reverse())
//     .enter()
//    .append("circle")
//    .attr("class", "gridCircle")
//    .attr("r", function(d, i){return radius/cfg.levels*d;})
//    .style("fill", "#CDCDCD")
//    .style("stroke", "#CDCDCD")
//    .style("fill-opacity", cfg.opacityCircles)
//    .style("filter" , "url(#glow)");
//
//  //Text indicating at what % each level is
//  axisGrid.selectAll(".axisLabel")
//     .data(d3.range(1,(cfg.levels+1)).reverse())
//     .enter().append("text")
//     .attr("class", "axisLabel")
//     .attr("x", 4)
//     .attr("y", function(d){return -d*radius/cfg.levels;})
//     .attr("dy", "0.4em")
//     .style("font-size", "10px")
//     .attr("fill", "#737373")
//     .text(function(d,i) { return Format(maxValue * d/cfg.levels); });
//
//  //Draw the axes
//  var axis = axisGrid.selectAll(".axis")
//      .data(allAxis)
//      .enter()
//    .append("g")
//      .attr("class", "axis");
//  //Append the lines
//  axis.append("line")
//      .attr("x1", 0)
//      .attr("y1", 0)
//      .attr("x2", function(d, i){return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2);})
//      .attr("y2", function(d, i){return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2);})
//      .attr("class", "line")
//      .style("stroke", "white")
//      .style("stroke-width", "2px");
//
////  //Append the labels at each axis
////  axis.append("text")
////      .attr("class", "legend")
////      .style("font-size", "11px")
////      .attr("text-anchor", "middle")
////      .attr("dy", "0.35em")
////      .attr("x", function(d, i){return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2);})
////      .attr("y", function(d, i){return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2);})
////      .text(function(d){return d})
////      .call(wrap, cfg.wrapWidth);
//// Append the labels at each axis
//axis.append("text")
//    .attr("class", "legend")
//    .style("font-size", "11px")
//    .attr("text-anchor", function(d, i) {
//        if (i === 0 || i === total / 2) return "middle"; // For top and bottom labels
//        else if (i < total / 2) return "start"; // For left labels
//        else return "end"; // For right labels
//    })
//    .attr("dy", function(d, i) {
//        if (i === 0) return "-0.5em"; // For top labels
//        else if (i === total / 2) return "1em"; // For bottom labels
//        else return "0.35em"; // For left and right labels
//    })
//    .attr("x", function(d, i) {
//        if (i === 0 || i === total / 2) return 0; // For top and bottom labels
//        else if (i < total / 2) return -rScale(maxValue * cfg.labelFactor); // For left labels
//        else return rScale(maxValue * cfg.labelFactor); // For right labels
//    })
//    .attr("y", function(d, i) {
//        if (i === 0) return -rScale(maxValue * cfg.labelFactor); // For top labels
//        else if (i === total / 2) return rScale(maxValue * cfg.labelFactor); // For bottom labels
//        else return 0; // For left and right labels
//    })
//    .text(function(d){return d});
//
//
//  //The radial line function
//  var radarLine = d3.svg.line.radial()
//      .interpolate("linear-closed")
//      .radius(function(d) { return rScale(d.value); })
//      .angle(function(d,i) {	return i*angleSlice; });
//
//  if(cfg.roundStrokes) {
//    radarLine.interpolate("cardinal-closed");
//  }
//
//  //Create a wrapper for the blobs
//  var blobWrapper = g.selectAll(".radarWrapper")
//      .data(data)
//      .enter().append("g")
//      .attr("class", "radarWrapper");
//
//  //Append the backgrounds
//  blobWrapper
//      .append("path")
//      .attr("class", "radarArea")
//      .attr("d", function(d,i) { return radarLine(d); })
//      .style("fill", function(d,i) { return cfg.color(i); })
//      .style("fill-opacity", cfg.opacityArea)
//      .on('mouseover', function (d,i){
//          //Dim all blobs
//          d3.selectAll(".radarArea")
//              .transition().duration(200)
//              .style("fill-opacity", 0);
//          //Bring back the hovered over blob
//          d3.select(this)
//              .transition().duration(200)
//              .style("fill-opacity", 0);
//      })
//      .on('mouseout', function(){
//          //Bring back all blobs
//          d3.selectAll(".radarArea")
//              .transition().duration(200)
//              .style("fill-opacity", cfg.opacityArea);
//      });
//
//  //Create the outlines
//  blobWrapper.append("path")
//      .attr("class", "radarStroke")
//      .attr("d", function(d,i) { return radarLine(d); })
//      .style("stroke-width", cfg.strokeWidth + "px")
//      .style("stroke", function(d,i) { return cfg.color(i); })
//      .style("fill", "none")
//      .style("filter" , "url(#glow)");
//
//  //Append the circles
//  blobWrapper.selectAll(".radarCircle")
//      .data(function(d,i) { return d; })
//      .enter().append("circle")
//      .attr("class", "radarCircle")
//      .attr("r", cfg.dotRadius)
//      .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
//      .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
//      .style("fill", function(d,i,j) { return cfg.color(j); })
//      .style("fill-opacity", 0.8);
//
//  //Wrapper for the invisible circles on top
//  var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
//      .data(data)
//      .enter().append("g")
//      .attr("class", "radarCircleWrapper");
//
//  //Append a set of invisible circles on top for the mouseover pop-up
//  blobCircleWrapper.selectAll(".radarInvisibleCircle")
//      .data(function(d,i) { return d; })
//      .enter().append("circle")
//      .attr("class", "radarInvisibleCircle")
//      .attr("r", cfg.dotRadius*1.5)
//      .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
//      .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
//      .style("fill", "none")
//      .style("pointer-events", "all")
//      .on("mouseover", function(d,i) {
//          newX =  parseFloat(d3.select(this).attr('cx')) - 10;
//          newY =  parseFloat(d3.select(this).attr('cy')) - 10;
//
//          tooltip
//              .attr('x', newX)
//              .attr('y', newY)
//              .text(Format(d.value))
//              .transition().duration(200)
//              .style('opacity', 0);
//      })
//      .on("mouseout", function(){
//          tooltip.transition().duration(200)
//              .style("opacity", 0);
//      });
//
//  //Set up the small tooltip for when you hover over a circle
//  var tooltip = g.append("text")
//      .attr("class", "tooltip")
//      .style("opacity", 0);
//
//  // Append legend
//  var legend = g.selectAll('.legend')
//      .data(genres)
//      .enter()
//      .append('g')
//      .attr('class', 'legend')
//      .attr('transform', function(d, i) {
//        var horz = cfg.w + 100;
//        var vert = i * 20 - cfg.h / 2;
//        return 'translate(' + horz + ',' + vert + ')';
//      });
//
//  legend.append('rect')
//      .attr('width', 18)
//      .attr('height', 18)
//      .style('fill', function(d, i) {
//        return cfg.color(i);
//      });
//
//  legend.append('text')
//      .attr('x', 24)
//      .attr('y', 9)
//      .attr('dy', '.35em')
//      .text(function(d) {
//        return d;
//      });
////  var radarAreas = blobWrapper
////    .append("path")
////    .attr("class", "radarArea")
////    .attr("d", function(d,i) { return radarLine(d); })
////    .style("fill", "none")
////    .style("stroke", function(d,i) { return cfg.color(i); })
////    .style("stroke-width", "2px")
////    .style("opacity", 0); // Set initial opacity to 0
////
////  radarAreas.on("mouseover", function(d, i) {
////      d3.select(this).style("fill", cfg.color(i)).style("opacity", 0.7);
////  });
////
////  radarAreas.on("mouseout", function(d, i) {
////      d3.select(this).style("fill", "none").style("opacity", 0);
////  });
//}

// Example usage:
// RadarChart('#radarplot', radarData, genres, radarChartOptions);


//function plotScatterplotMatrix(data, num_of_clusters) {
//
//
//  d3.select("#scatterplot").selectAll("*").remove();
//  const columns = Object.keys(data[0]).filter(function(d) { return d !== "labels"; });
//  const numColumns = columns.length;
//
//
//  const plotSize = 80,
//    padding = 50,
//    width = (numColumns * plotSize) + ((numColumns + 1) * padding),
//    height = (numColumns * plotSize) + ((numColumns + 1) * padding);
//
//
//  const svg = d3.select("#scatterplot").append("svg")
//    .attr("width", width)
//    .attr("height", height)
//    .append("g");
//
//
//  var x = d3.scale.linear()
//    .range([0, plotSize]),
//    y = d3.scale.linear().range([plotSize, 0]);
//
//
//  const color = d3.scale.category10();
//
//
//  for (let i = 0; i < numColumns; i++) {
//    for (let j = 0; j < numColumns; j++) {
//      const xColumn = columns[i],
//        yColumn = columns[j];
//
//
//      const xExtent = d3.extent(data, d => d[xColumn]);
//      const yExtent = d3.extent(data, d => d[yColumn]);
//      const maxExtent = Math.max(Math.abs(xExtent[0]), Math.abs(xExtent[1]), Math.abs(yExtent[0]), Math.abs(yExtent[1]));
//      x.domain([0, maxExtent]).nice();
//      y.domain([0, maxExtent]).nice();
//
//
//      const plot = svg.append("g")
//        .attr("transform", "translate(" + (padding + i * (plotSize + padding)) + "," + (padding + j * (plotSize + padding)) + ")");
//
//
//      plot.selectAll("dot")
//        .data(data)
//        .enter().append("circle")
//        .attr("r", 3.5)
//        .attr("cx", d => x(d[xColumn]))
//        .attr("cy", d => y(d[yColumn]))
//        .style("fill", d => color(d.labels)); // Color based on cluster label
//
//
//      if (j === numColumns - 1) {
//        plot.append("g")
//          .attr("transform", "translate(0," + plotSize + ")")
//          .call(d3.axisBottom(x).ticks(4));
//      } else {
//        plot.append("g")
//          .attr("transform", "translate(0," + plotSize + ")")
//          .call(d3.axisBottom(x).ticks(4).tickSizeOuter(0));
//      }
//
//
//      if (i === 0) {
//        plot.append("g")
//          .call(d3.axisLeft(y).ticks(4));
//      } else {
//        plot.append("g")
//          .call(d3.axisLeft(y).ticks(4).tickSizeOuter(0));
//      }
//
//
//      if (i === j) {
//        plot.append("text")
//          .attr("x", plotSize / 2)
//          .attr("y", plotSize + (padding + 20) / 2)
//          .style("text-anchor", "middle")
//          .text(formatAttributeName(xColumn))
//          .attr("transform", "rotate(0 " + plotSize / 2 + "," + (plotSize + padding / 2) + ")");
//      }
//    }
//  }
//
//  svg.append("text")
//                .attr("x", (width / 2))
//                .attr("y", (height/2)-260)
//                .attr("text-anchor", "middle")
//                .style("font-size", "16px")
//                .style("text-decoration", "underline")
//                .text("Pairwise Scatter Plot for top 4 Attributes");
//
//  function formatAttributeName(attributeName) {
//    return attributeName.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
//  }
//
//
//}
function plotScatterplotMatrix(data, num_of_clusters) {

  d3.select("#scatterplot").selectAll("*").remove();
  var columns = Object.keys(data[0]).filter(function(d) { return d !== "labels"; });
  var numColumns = columns.length;

  var plotSize = 70,
      padding = 40,
      width = (numColumns * 80) + ((numColumns + 1) * padding),
      height = (numColumns * plotSize) + ((numColumns + 1) * padding);

  var svg = d3.select("#scatterplot").append("svg")
      .attr("width", 600)
      .attr("height", 500)
      .append("g");

  var x = d3.scale.linear()
      .range([0, plotSize]);
  var y = d3.scale.linear().range([plotSize, 0]);

  var color = d3.scale.category10();

  for (var i = 0; i < numColumns; i++) {
    for (var j = 0; j < numColumns; j++) {
      var xColumn = columns[i];
      var yColumn = columns[j];

      var xExtent = d3.extent(data, function(d) { return d[xColumn]; });
      var yExtent = d3.extent(data, function(d) { return d[yColumn]; });
      var maxExtent = Math.max(Math.abs(xExtent[0]), Math.abs(xExtent[1]), Math.abs(yExtent[0]), Math.abs(yExtent[1]));
      x.domain([0, maxExtent]).nice();
      y.domain([0, maxExtent]).nice();

      var plot = svg.append("g")
          .attr("transform", "translate(" + (padding + i * (plotSize + padding)) + "," + (padding + j * (plotSize + padding)) + ")");

      plot.selectAll("dot")
          .data(data)
          .enter().append("circle")
          .attr("r", 3.5)
          .attr("cx", function(d) { return x(d[xColumn]); })
          .attr("cy", function(d) { return y(d[yColumn]); })
          .style("fill", function(d) { return color(d.labels); }); // Color based on cluster label

      if (j === numColumns - 1) {
        plot.append("g")
            .attr("transform", "translate(0," + plotSize + ")")
            .call(d3.svg.axis().scale(x).orient("bottom").ticks(4));
      } else {
        plot.append("g")
            .attr("transform", "translate(0," + plotSize + ")")
            .call(d3.svg.axis().scale(x).orient("bottom").ticks(4));
      }

      if (i === 0) {
        plot.append("g")
            .call(d3.svg.axis().scale(y).orient("left").ticks(4));
      } else {
        plot.append("g")
            .call(d3.svg.axis().scale(y).orient("left").ticks(4));
      }

      if (i === j) {
        plot.append("text")
            .attr("x", plotSize / 2)
            .attr("y", plotSize + (padding + 30) / 2)
            .style("text-anchor", "middle")
            .text(formatAttributeName(xColumn))
            .attr("transform", "rotate(0 " + plotSize / 2 + "," + (plotSize + padding / 2) + ")");
      }
    }
  }

  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", (height-460))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text("Pairwise Scatter Plot for top 4 Attributes");

  function formatAttributeName(attributeName) {
    return attributeName.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
  }
}


function render_plot_1_options() {
  // Get the dropdown element
  const dropdown = document.getElementById('graph1dropdown1options');

  // Populate the dropdown with options
  graph1_dropdown1_options_arr.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    dropdown.appendChild(optionElement);
  });

  // Add event listener to the dropdown
  dropdown.addEventListener('change', function () {
    const selected_option = this.value;
    console.log('Selected option:', selected_option);
    // Fetch data and update plot based on selected option
    render_plot_1(selected_option);
  });
  render_plot_1(graph1_dropdown1_options_arr[0]);
}
function render_plot_1(selected_option) {
  // Refer to: https://d3-graph-gallery.com/graph/boxplot_show_individual_points.html
  // Also Refer Here: https://d3-graph-gallery.com/graph/boxplot_horizontal.html

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 90, left: 40 },
    width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const render_graph1_container = d3.select('#graph1');
  render_graph1_container.selectAll('*').remove();

  // append the svg object to the body of the page
  var svg = d3.select("#graph1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
      .key(function (d) { return d["fav_genre"]; })
      .rollup(function (d) {
        q1 = d3.quantile(d.map(function (g) { return g[selected_option]; }).sort(d3.ascending), .25)
        median = d3.quantile(d.map(function (g) { return g[selected_option]; }).sort(d3.ascending), .5)
        q3 = d3.quantile(d.map(function (g) { return g[selected_option]; }).sort(d3.ascending), .75)
        interQuantileRange = q3 - q1
        min = q1 - 1.5 * interQuantileRange
        max = q3 + 1.5 * interQuantileRange
        return ({ q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max })
      })
      .entries(graph1_data)

    var unique_fav_genres = graph1_data.map(d => d["fav_genre"]);

    // Show the Y scale
//    var x = d3.scaleBand()
//      .range([0, width])
//      .domain(unique_fav_genres)
//      .paddingInner(1)
//      .paddingOuter(.5)
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .5)
    .domain(unique_fav_genres);

//    svg.append("g")
//      .attr("transform", "translate(0," + height + ")")
//      .call(d3.axisBottom(x))
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.svg.axis().scale(x).orient("bottom"))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
        return "rotate(-45)";
    });
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(selected_option +" Scores");

    //.attr("transform", "rotate(-45)");

    // Show the X scale
//    var y = d3.scaleLinear()
//      .domain([-0.5, 10.5])
//      .range([height, 0])
//    svg.append("g").call(d3.axisLeft(y))
var y = d3.scale.linear()
    .domain([-0.5, 10.5])
    .range([height, 0]);
svg.append("g")
    .call(d3.svg.axis().scale(y).orient("left"));

    // Color scale
//    var myColor = d3.scaleSequential()
//      .interpolator(d3.interpolateInferno)
//      .domain([-0.5, 10.5])
//var myColor = d3.scale.linear()
//    .domain([-0.5, 10.5])
//    .range([d3.interpolateInferno(0), d3.interpolateInferno(1)]);
var myColor = d3.scale.category10();

    // Add X axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width/2)
      .attr("y", height + margin.top + 50)
      .text("Favourite Genre");

    // Show the main vertical line
    console.log(sumstat);
    svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key))})
      .attr("x2", function(d){return(x(d.key))})
      .attr("y1", function(d){return(y(Math.max(0, d.values.min)))})
      .attr("y2", function(d){return(y(Math.min(10, d.values.max)))})
      .attr("stroke", "blue")
      .style("width", 40)

      var boxWidth = 20
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.values.q3))})
        .attr("height", function(d){return(y(d.values.q1)-y(d.values.q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")
        .style("opacity", 0.3)

  svg
  .selectAll("medianLines")
  .data(sumstat)
  .enter()
  .append("line")
    .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
    .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
    .attr("y1", function(d){return(y(d.values.median))})
    .attr("y2", function(d){return(y(d.values.median))})
    .attr("stroke", "black")
    .style("width", 80)


    // create a tooltip
    var tooltip = d3.select("#graph1")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("font-size", "16px")
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 1)
      tooltip
        .html("<span style='color:grey'>" + d["fav_genre"] + ": </span>" + d[selected_option]) // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var mousemove = function (d) {
      tooltip
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var mouseleave = function (d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }

    // Add individual points with jitter
var jitterWidth = 30
svg
  .selectAll("indPoints")
  .data(graph1_data)
  .enter()
  .append("circle")
    .attr("cx", function(d){return(x(d["fav_genre"]) - jitterWidth/2 + Math.random()*jitterWidth )})
    .attr("cy", function(d){return(y(d[selected_option]))})
    .attr("r", 4)
    .style("fill", function (d) { return (myColor(+d[selected_option])) })
    .attr("stroke", "black")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
}

function convertToObject(data) {
  var keys = Object.keys(data);
  var values = Object.values(data);
  var numObjects = values[0].length;

  var convertedData = [];

  for (var i = 0; i < numObjects; i++) {
    var obj = {};
    keys.forEach(function(key, index) {
      obj[key] = data[key][i];
    });
    convertedData.push(obj);
  }

  return convertedData;
}

function render_scatter_plot()
{
        $.get('/kmeans/'+2, function(data) {
        //generateTable(data.table);
        plotScatterplotMatrix(data,2);

    });
}
function initialize(data) {
  fetch(`/graph1_fetch_data`)
    .then(response => response.json())
    .then(data => {
      graph1_data = convertToObject(data.result);
      console.log(graph1_data);
      render_plot_1_options();
      render_scatter_plot();
      mds_rows_plot(3);
      plotRadarPlot();

    })
    .catch(error => console.error("Error Reading Graph1 Box Plot Data:", error));
}


// Function to run the Python script and fetch data
function runPythonScriptAndInitialize() {
  fetch('/run_script')
  .then(response => response.json())
  .then(data => {
    initialize();
  })
  .catch(error => console.error('Error:', error));
}



// Call the function to run the Python script and initialize the webpage
runPythonScriptAndInitialize();