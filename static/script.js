const graph1_dropdown1_options_arr = ["anxiety", "depression", "insomnia", "ocd"];
let graph1_data, graph4_data;
colorScale = d3.scale.category20();
selectedPointsLabels=['Classical', 'Country', 'EDM', 'Folk', 'Gospel', 'Hip hop', 'Jazz', 'K pop', 'Latin', 'Lofi', 'Metal', 'Pop', 'R&B', 'Rap', 'Rock', 'Video game music']
selectedColumns = ["age","fav_genre", "primary_streaming_service", "hours_per_day", 'bpm', "anxiety", "depression", "insomnia", "ocd"]
favourite_cluster="None";
number_of_clusters=3;

//function drawHorizontalBarChart() {
//
//// Example data
//var data = [
//  { category: "Anxiety", score: 5.88 },
//  { category: "Depression", score: 4.89 },
//  { category: "insomnia", score: 3.80 },
//  {category: "ocd", score: 2.65}
//];
//  // Set up dimensions and margins
//  var margin = {top: 20, right: 20, bottom: 20, left: 20},
//      width =200 - margin.left - margin.right,
//      height = 120 - margin.top - margin.bottom;
//
//  // Create SVG element
//  var svg = d3.select("#menta_health")
//    .append("svg")
//    .attr("width", width + margin.left + margin.right)
//    .attr("height", height + margin.top + margin.bottom)
//    .append("g")
//    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//  // Create scales
//  var xScale = d3.scale.linear()
//    .domain([0, d3.max(data, function(d) { return d.score; })])
//    .range([0, width]);
//
//  var yScale = d3.scale.ordinal()
//    .domain(data.map(function(d) { return d.category; }))
//    .rangeRoundBands([0, height], 0.1);
//colorScale = d3.scale.category20c();
//  // Create bars
//  svg.selectAll(".bar")
//    .data(data)
//    .enter().append("rect")
//    .attr("class", "bar")
//    .attr("x", 0)
//    .attr("y", function(d) { return yScale(d.category); })
//    .attr("width", function(d) { return xScale(d.score); })
//    .style("fill", function(d, i) { return colorScale(i)})
//    .attr("height", yScale.rangeBand());
//
//  // Add category labels
//  svg.selectAll(".label")
//    .data(data)
//    .enter().append("text")
//    .attr("class", "label")
//    .attr("x", 10)
//    .attr("y", function(d) { return yScale(d.category) + yScale.rangeBand() / 2; })
//    .attr("dy", ".35em")
//    .text(function(d) { return d.category; });
//
//  // Remove x-axis and y-axis lines
//  svg.selectAll(".axis").remove();
//}

function slider()
{
var margin = {top: 30, right: 20, bottom: 30, left: 20},
    width = 120,
    height = 300;

// Create SVG element for the slider
var svg = d3.select("#slider").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create scale for the slider
var y = d3.scale.linear()
    .domain([1, 8])
    .range([0, height])
    .clamp(true);

// Add slider track
svg.append("line")
    .attr("class", "track")
    .attr("x1", width / 2)
    .attr("x2", width / 2)
    .attr("y1", 0)
    .attr("y2", height);

// Add ticks
var ticks = [1, 2, 3, 4, 5, 6, 7, 8];
svg.selectAll(".tick")
    .data(ticks)
  .enter().append("line")
    .attr("class", "tick")
    .attr("x1", width / 2 - 5)
    .attr("x2", width / 2 + 5)
    .attr("y1", function(d) { return y(d); })
    .attr("y2", function(d) { return y(d); });
// Add tick labels
svg.selectAll(".tick-label")
    .data(ticks)
  .enter().append("text")
    .attr("class", "tick-label")
    .attr("x", width / 2 + 10)
    .attr("y", function(d) { return y(d); })
    .attr("dy", "0.35em")
    .text(function(d) { return d; });


// Add slider handle
var handle = svg.insert("circle", ".track")
    .attr("class", "handle")
    .attr("r", 10)
    .attr("cx", width / 2)
    .attr("cy", y(3))
    .style("cursor", "pointer");

svg.append("text")
    .attr("class", "title")
    .attr("x", 20)
    .attr("y", 330)
    .style("font-weight", "bold")
    .text("Adjust Clusters");

// Define drag behavior
var drag = d3.behavior.drag()
    .on("dragstart", function() { handle.attr("fill", "red"); })
    .on("drag", dragmove)
    .on("dragend", function() { handle.attr("fill", null); });

// Apply drag behavior to handle
handle.call(drag);

// Function to handle dragging of the slider handle
function dragmove(d) {
  var newValue = Math.round(y.invert(d3.event.y));
  var oldValue = Math.round(y.invert(d3.select(this).attr("cy")));
  newValue = Math.max(1, Math.min(8, newValue)); // Clamp value between 1 and 8
  handle.attr("cy", y(newValue));
    if (newValue !== oldValue) {
    d3.select(this).attr("cy", y(newValue));
    console.log(newValue); // Call helixmap() function with the new value
    number_of_clusters=newValue;
    mds_rows_plot(number_of_clusters, favourite_cluster);
  }
}

}

function drawHorizontalBarChart() {
  // Example data
  var data = [
    { category: "Anxiety", score: 5.88 },
    { category: "Depression", score: 4.89 },
    { category: "insomnia", score: 3.80 },
    { category: "ocd", score: 2.65 }
  ];

  // Set up dimensions and margins
  var margin = { top: 20, right: 20, bottom: 20, left: 40 },
      width = 300 - margin.left - margin.right,
      height = 120 - margin.top - margin.bottom;

  // Create SVG element
  var svg = d3.select("#menta_health")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create scales
  var xScale = d3.scale.linear()
                 .domain([0, d3.max(data, function (d) { return d.score; })])
                 .range([0, width]);

  var yScale = d3.scale.ordinal()
                 .domain(data.map(function (d) { return d.category; }))
                 .rangeRoundBands([0, height], 0.1);

  var colorScale = d3.scale.category20c();

  // Create bars
  svg.selectAll(".bar")
     .data(data)
     .enter().append("rect")
     .attr("class", "bar")
     .attr("x", 0)
     .attr("y", function (d) { return yScale(d.category); })
     .attr("width", function (d) { return xScale(d.score); })
     .style("fill", function (d, i) { return colorScale(i) })
     .on("click", function(d) {
        var categoryLowercase = d.category.toLowerCase();
        console.log(categoryLowercase);
        render_plot_1(categoryLowercase);
     })
     .attr("height", yScale.rangeBand());

  // Add category labels
  svg.selectAll(".label")
     .data(data)
     .enter().append("text")
     .attr("class", "label")
     .attr("x", 10)
     .attr("y", function (d) { return yScale(d.category) + yScale.rangeBand() / 2; })
     .attr("dy", ".35em")
     .text(function (d) { return d.category; });

  // Add X-axis ticks
  var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(5);

  svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

  // Remove y-axis lines
  svg.selectAll(".y.axis").remove();
}





        function plotageHistogram() {

            var blueColorScheme = ['#1f77b4', '#aec7e8', '#6baed6', '#3182bd', '#08519c'];
            // Fetch data from API
            d3.json("/age_hist/", function(error, data) {
                if (error) {
                    console.error("Error fetching data:", error);
                    return;
                }

                // Set up dimensions and margins
                var margin = { top: 0, right: 0, bottom: 15, left:0 },
                    width = 200 - margin.left - margin.right,
                    height =100 - margin.top - margin.bottom;

                // Set up scale for x-axis
                var x = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) { return d.age; })])
                    .range([0, width]);

                // Set up histogram layout
                var histogram = d3.layout.histogram()
                    .bins(x.ticks(4))
                    .value(function(d) { return d.age; });

                // Calculate histogram data
                var bins = histogram(data);

                // Set up scale for y-axis
                var y = d3.scale.linear()
                    .domain([0, d3.max(bins, function(d) { return d.y; })])
                    .range([height, 0]);

                // Create SVG
                var svg = d3.select("#agehist").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                colorScale = d3.scale.category20c();
                // Append rectangles for histogram bars
                svg.selectAll(".bar")
                    .data(bins)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.x); })
                    .attr("width", x(bins[0].dx) - 1)
                    .attr("y", function(d) { return y(d.y); })
                    .style("fill", function(d, i) { return colorScale(i)})
                    .attr("height", function(d) { return height - y(d.y); });

                // Create x-axis
                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .tickFormat(function(d) { return d; });

                // Append x-axis to SVG
                var xAxisGroup =svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
                xAxisGroup.selectAll("text")
                    .attr("transform", "rotate(-90)")
                    .style("text-anchor", "end")
                    .attr("dx", "-.2em")
                    .attr("dy", ".2em")
                    .style("font-size", "10px");

                // Hide x-axis line
                svg.select(".x.axis").selectAll("path").style("display", "none");

                // Hide y-axis line
                svg.select(".x.axis").selectAll("line").style("display", "none");
            });
        }

// Define the function to make API call and plot donut chart
function plotDonutChart() {
    // Make a GET request to the API
    d3.json("/donut_effects/", function(error, data) {
        if (error) {
            console.error("Error fetching data:", error);
            return;
        }

        // Set up chart dimensions
        var width = 200,
            height = 120,
            radius = Math.min(width, height) / 2;

        // Set up color scale
        var color = d3.scale.category20c();

        // Create arc
        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 30);

        // Create pie layout
        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.count; });

        // Append SVG to the body
        var svg = d3.select("#donut_effects").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Create donut chart
        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        // Append path for each arc
        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.music_effects); });

//        // Append text labels
//        g.append("text")
//            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
//            .attr("dy", ".15em")
//            .style("text-anchor", "middle")
//            .text(function(d) { return d.data.music_effects; });
        // Append text labels
        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.data.music_effects; });



    });
}






function plot_pcp_plot(columns) {
    // Fetch data from the API endpoint

        var pcz;
        //console.log(num_of_clusters);
        console.log(columns);


        // load csv file and create the chart
         $.get('/pcp_data/', function(data) {
         d3.select("#pcp_plot").selectAll("*").remove();


        // Extract and order columns based on the 'columns' parameter
        var orderedData = data.map(function(d) {
            var ordered = {};
            columns.forEach(function(column) {
                ordered[column] = d[column];
            });
            return ordered;
        });
            var width=1400;
            var height= 500;
        colorScale = d3.scale.category10();
colorScale.domain(d3.set(data.map(function(d) { return d['fav_genre']; })).values());
          pcz = d3.parcoords()('#pcp_plot')
//          .bundlingStrength(100)
//          .bundleDimension("cylinders")
            .width(width)
            .height(height)
            .margin({ top: 80, right: 20, bottom: 20, left: 20 })
            .data(orderedData)
            .hideAxis(["cluster"])
            .composite("darken")
            .color(function(d) { return colorScale(d['fav_genre']); })
            .render()
            .alpha(0.35)
            .brushMode("1D-axes")  // enable brushing
            .interactive()
            .reorderable();
          //pcz.bundlingStrength(100).render();
          pcz.bundlingStrength(100).render();

var svg = d3.select("#pcp_plot").select("svg");
var title = svg.append("text")
               .attr("x", width / 2)
               .attr("y", 20)
               .attr("text-anchor", "middle")
               .style("font-size", "16px")
               .style("font-weight", "bold")
               .text("Parallel Coordinates Plot");


pcz.on('resize', function() {
    // Adjust the title position when resizing
    title.attr("x", width / 2);
});

        });

}





//function mds_rows_plot(num_clusters) {
//    $.get('/mds_row_data/' + num_clusters, function(data) {
//        // Render scatter plot using D3.js
//        d3.select("#mds_row_plot").selectAll("*").remove();
//        const margin = { top: 50, right: 50, bottom: 80, left: 100 };
//        const width = 500 - margin.left - margin.right;
//        const height = 400 - margin.top - margin.bottom;
//        colorScale = d3.scale.category20();
//
//        const svg = d3.select('#mds_row_plot').append('svg')
//            .attr('width', width + margin.left + margin.right)
//            .attr('height', height + margin.top + margin.bottom)
//            .append('g')
//            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
//
//        // Set up scales
//        const xScale = d3.scale.linear()
//            .domain(d3.extent(data, function(d) { return d.x; }))
//            .range([0, width])
//            .nice();
//
//        const yScale = d3.scale.linear()
//            .domain(d3.extent(data, function(d) { return d.y; }))
//            .range([height, 0])
//            .nice();
//
//        // Define color scale for clusters
//        //const colorScale = d3.scale.category10();
//
//        // Draw points
//        svg.selectAll('circle')
//            .data(data)
//            .enter().append('circle')
//            .attr('cx', function(d) { return xScale(d.x); })
//            .attr('cy', function(d) { return yScale(d.y); })
//            .attr('r', 5)
//            .style('fill', function(d) { return colorScale(d.cluster); });
//
//        // Axes labels
//        svg.append('text')
//            .attr('transform', 'translate(' + (width / 2) + ',' + (height + margin.top + 10) + ')')
//            .style('text-anchor', 'middle')
//            .text('Dimension 1');
//
//        svg.append('text')
//            .attr('transform', 'rotate(-90)')
//            .attr('y', 0 - (margin.left/2))
//            .attr('x', 0 - (height / 2))
//            .attr('dy', '1em')
//            .style('text-anchor', 'middle')
//            .text('Dimension 2');
//
//        // Draw x-axis
////        svg.append('g')
////            .attr('transform', 'translate(0,' + height + ')')
////            .call(d3.svg.axis().scale(xScale).orient('bottom'));
//svg.append('g')
//    .attr('transform', 'translate(0,' + height + ')')
//    .call(d3.svg.axis().scale(xScale).orient('bottom'))
//    .selectAll('text')
//    .attr('transform', 'rotate(-45)')
//    .style('text-anchor', 'end');
//
//        // Draw y-axis
//        svg.append('g')
//            .call(d3.svg.axis().scale(yScale).orient('left'));
//
//        // Plot title
//        svg.append('text')
//            .attr('x', (width / 2))
//            .attr('y', 0 - (margin.top / 2))
//            .attr('text-anchor', 'middle')
//            .style('font-size', '16px')
//            .text('MDS Data Plot');
//
//        // Legend
//        const legend = svg.selectAll('.legend')
//            .data(colorScale.domain())
//            .enter().append('g')
//            .attr('class', 'legend')
//            .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')'; });
//
//        legend.append('rect')
//            .attr('x', width - 18)
//            .attr('width', 18)
//            .attr('height', 18)
//            .style('fill', colorScale);
//
//        legend.append('text')
//            .attr('x', width - 24)
//            .attr('y', 9)
//            .attr('dy', '.35em')
//            .style('text-anchor', 'end')
//            //.attr('transform', 'rotate(-45)')
//            .text(function(d) { return 'Cluster ' + d; });
//    });
//}

function mds_rows_plot(num_clusters, fav_cluster) {
    $.get('/mds_row_data/' + num_clusters, function(data) {
        // Render scatter plot using D3.js
        d3.select("#mds_row_plot").selectAll("*").remove();
        const margin = { top: 30, right: 50, bottom: 60, left: 150 };
        const width = 650 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        colorScale = d3.scale.category20();

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
            .style('fill', function(d) { return colorScale(d.cluster); })
            .style('stroke-width', function(d) { return d.fav_genre === fav_cluster ? 3 : 0; })
            .style('stroke', 'black');

        // Axes labels
        svg.append('text')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height + margin.top + 20) + ')')
            .style('text-anchor', 'middle')
            .text('Dimension 1');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - (margin.left/2)-20)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Dimension 2');

        // Draw x-axis
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
            .style("font-weight", "bold")
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
            .text(function(d) { return 'Cluster ' + d; });
    });
}



function plotRadarPlot(favGenres) {
  d3.select("#radarplot").selectAll("*").remove();

  // Make a GET request to fetch data from the API
  $.get('/radar_plot', function(data) {
    var radarData = [];
    var genres = [];

    // Extracting data
    // Extracting data
    data.forEach(function(d) {
      // Check if the favorite genre matches any of the provided genres
      if (favGenres.includes(d.fav_genre)) {
        var genre = d.fav_genre;
        genres.push(genre);
        radarData.push([
          {axis: "Anxiety", value: d.anxiety},
          {axis: "Depression", value: d.depression},
          {axis: "Insomnia", value: d.insomnia},
          {axis: "OCD", value: d.ocd}
        ]);
      }
    });


    // Radar chart configuration
    var margin = {top: 50, right: 50, bottom: 50, left: 100},
        width =400 //Math.min(400, window.innerWidth - 10) - margin.left - margin.right,
        height = 400//Math.min(400, window.innerHeight - margin.top - margin.bottom - 20);

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

  svg.append("text")
    .attr("class", "title")
    .attr("x", 400/2)
    .attr("y", -20)
    .style("font-weight", "bold")
    .text("Radar Plot");


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
          if (i === 0) return -rScale(cfg.maxValue * 1); // For top labels
          else if (i === total / 2) return rScale(cfg.maxValue * 1); // For bottom labels
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
  var margin = { top: 30, right: 30, bottom: 60, left: 100 },
    width = 1000 - margin.left - margin.right,
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
  // Add title
svg.append("text")
    .attr("class", "title")
    .attr("x", width/2-250)
    .attr("y", -10)
    .style("font-weight", "bold")
    .text("Box Plot for Mental Health Scores Across Favourite Genre");


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
    .attr("y", 0 - (margin.left/2))
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

      var boxWidth = 20;
      const selectedPoints = []; // Array to store selected points
      selectedPointsLabels_sub = [];

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
        .style("fill", "#C6DBE4")
        .style("opacity", 0.3)
        .on('click', function(d) {
                console.log(d3.select(this).datum());
                //d3.select(this).classed('selected', !d3.select(this).classed('selected'));
                //const selectedPoints = svg.selectAll('.selected').data();
                //console.log(selectedPoints);
                const isSelected = d3.select(this).classed('selected');
                console.log(isSelected);

                if (isSelected) {
                    d3.select(this).classed('selected', false);
                    const index = selectedPoints.findIndex(function(p) { return p === d; });
                    selectedPoints.splice(index, 1);
                } else {
                    d3.select(this).classed('selected', true);
                    //console.log(d);
                    selectedPoints.push(d3.select(this).datum());
                    selectedPointsLabels_sub.push(d3.select(this).datum().key);
                    favourite_cluster=d3.select(this).datum().key;
                    mds_rows_plot(number_of_clusters,favourite_cluster );
                    //console.log(selectedPointsLabels);
                }
                //selectedPointsLabels_sub.push('cluster');
                selectedPointsLabels=selectedPointsLabels_sub;
                //joinSelectedPoints(svg, selectedPoints, xScale, yScale, selectedPointsLabels);
                plotRadarPlot(selectedPointsLabels);
            });


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
    .attr("r", 3)
    .style("fill", function (d) { return (myColor(unique_fav_genres.indexOf(d["fav_genre"]))) })
    //.attr("stroke", "black")
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
// Define your SVG dimensions, scales, and other setup here

function render_plot_4() {
    // Define SVG dimensions and margins
    var margin = { top: 40, right: 160, bottom: 70, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Append SVG element to the specified ID
    var svg = d3.select("#graph4")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define color scale for properties
    var colorScale = d3.scale.category10();

    // Define x scale for hours_per_day
    var xScale = d3.scale.linear()
        .domain([0, d3.max(graph4_data, function(d) { return +d.hours_per_day; })])
        .range([0, width]);

    // Define y scale for properties
    var yScale = d3.scale.linear()
        .domain([0, d3.max(graph4_data, function(d) {
            var values = Object.keys(d).map(function(key) {
                return key !== 'hours_per_day' ? +d[key] : null;
            });
            return d3.max(values);
        })])
        .range([height, 0]);

    // Create x axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    // Create y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    // Append x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Append x axis label
    svg.append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom / 2)
        .style("text-anchor", "middle")
        .text("Hours Per Day");

    // Append y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Append y axis label
    svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left / 2-10)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Property Value");

    // Loop through each property (excluding 'hours_per_day')
    Object.keys(graph4_data[0]).forEach(function(property) {
        if (property !== 'hours_per_day') {
            // Add individual points for the current property with jitter
            svg.selectAll(".dot-" + property)
                .data(graph4_data)
                .enter()
                .append("circle")
                    .attr("class", "dot dot-" + property)
                    .attr("cx", function(d) {
                        // Add jitter to x-coordinate
                        return xScale(+d.hours_per_day) + Math.random() * 10 - 5; // Adjust jitter range as needed
                    })
                    .attr("cy", function(d) {
                        // Add jitter to y-coordinate
                        return yScale(+d[property]) + Math.random() * 10 - 5; // Adjust jitter range as needed
                    })
                    .attr("r", 4)
                    .style("fill", colorScale(property)) // Use different color for each property
                    .attr("stroke", "black");
        }
    });

    // Create legend
    var legend = svg.selectAll(".legend")
        .data(Object.keys(graph4_data[0]).filter(function(property) { return property !== 'hours_per_day'; }))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (width + 10) + "," + (10 + i * 20) + ")"; });

    // Add colored rectangles to legend
    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return colorScale(d); });

    // Add text labels to legend
    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });

    // Add title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Scatter Plot of Hrs Per Day vs Mental Health Scores");
}

//function render_plot_4() {
//    // Define color scale for mental health columns
//    console.log(graph4_data);
//var colorScale = d3.scale.category10();
//
//// Alternatively, you can manually specify colors:
//// var colorScale = d3.scale.ordinal().range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]);
//
//// If you want to exclude 'fav_genre' from the domain, you can do it manually:
//var keys = Object.keys(graph4_data[0]).filter(function(d) { return d !== 'fav_genre'; });
//var colorScale = d3.scale.ordinal().domain(keys).range(d3.scale.category10().range());
//
//
//    // Define SVG dimensions and margins
//    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
//        width = 600 - margin.left - margin.right,
//        height = 400 - margin.top - margin.bottom;
//// Define x and y scales
//var x = d3.scale.linear()
//    .domain([0, d3.max(graph4_data, function(d) { return +d.hours_per_day; })])
//    .range([0, width]);
//
//var y = d3.scale.linear()
//    .domain([0, d3.max(graph4_data, function(d) { return +d[selected_option]; })])
//    .range([height, 0]);
//
//    // Append SVG element to the specified ID
//    var svg = d3.select("#graph4")
//        .append("svg")
//        .attr("width", width + margin.left + margin.right)
//        .attr("height", height + margin.top + margin.bottom)
//        .append("g")
//        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//    // Add individual points
//    svg.selectAll(".dot")
//        .data(graph4_data)
//        .enter()
//        .append("circle")
//            .attr("class", "dot")
//            .attr("cx", function(d) { return x(+d.hours_per_day); })
//            .attr("cy", function(d) { return y(+d[selected_option]); }) // Assuming selected_option is the mental health column
//            .attr("r", 4)
////            .style("fill", function(d) { return colorScale(Object.keys(d).find(key => key !== 'fav_genre')); }) // Color based on mental health column
//            .style("fill", "black") // Color based on mental health column
//            .attr("stroke", "black")
//            .on("mouseover", mouseover)
//            .on("mousemove", mousemove)
//            .on("mouseleave", mouseleave);
//}

function initialize(data) {
  fetch(`/graph1_fetch_data`)
    .then(response => response.json())
    .then(data => {
      graph1_data = convertToObject(data.result);
      console.log(graph1_data);
      render_plot_1_options();
      render_scatter_plot();
      mds_rows_plot(number_of_clusters,favourite_cluster);
      plotRadarPlot(selectedPointsLabels);
      plot_pcp_plot(selectedColumns);
      plotDonutChart();
      drawHorizontalBarChart();
      plotageHistogram();
      slider();

    })
    .catch(error => console.error("Error Reading Graph1 Box Plot Data:", error));

    fetch(`/graph4_fetch_data`)
    .then(response => response.json())
    .then(data => {
      graph4_data = convertToObject(data.result);
        render_plot_4();
    })
    .catch(error => console.error("Error Reading Graph2 Scatter Plot Data of Hrs vs Metal Health Scores:", error));

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