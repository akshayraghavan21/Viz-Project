const graph1_dropdown1_options_arr = ["anxiety", "depression", "insomnia", "ocd"];
let graph1_data;
colorScale = d3.scale.category10();
function mds_rows_plot(num_clusters) {
    $.get('/mds_row_data/' + num_clusters, function(data) {
        // Render scatter plot using D3.js
        d3.select("#mds_row_plot").selectAll("*").remove();
        const margin = { top: 50, right: 50, bottom: 80, left: 70 };
        const width = 400 - margin.left - margin.right;
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
        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.svg.axis().scale(xScale).orient('bottom'));

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
            .text(function(d) { return 'Cluster ' + d; });
    });
}

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

  var plotSize = 80,
      padding = 50,
      width = (numColumns * plotSize) + ((numColumns + 1) * padding),
      height = (numColumns * plotSize) + ((numColumns + 1) * padding);

  var svg = d3.select("#scatterplot").append("svg")
      .attr("width", width)
      .attr("height", height)
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
            .attr("y", plotSize + (padding + 20) / 2)
            .style("text-anchor", "middle")
            .text(formatAttributeName(xColumn))
            .attr("transform", "rotate(0 " + plotSize / 2 + "," + (plotSize + padding / 2) + ")");
      }
    }
  }

  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", (height/2)-260)
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
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
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
    .call(d3.svg.axis().scale(x).orient("bottom"));

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
      .attr("x", width)
      .attr("y", height + margin.top + 30)
      .text("Sepal Length");

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
var jitterWidth = 50
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