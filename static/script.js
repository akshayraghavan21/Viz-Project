const graph1_dropdown1_options_arr = ["anxiety", "depression", "insomnia", "ocd"];
let graph1_data;
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
    var x = d3.scaleBand()
      .range([0, width])
      .domain(unique_fav_genres)
      .paddingInner(1)
      .paddingOuter(.5)
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

    // Show the X scale
    var y = d3.scaleLinear()
      .domain([-0.5, 10.5])
      .range([height, 0])
    svg.append("g").call(d3.axisLeft(y))

    // Color scale
    var myColor = d3.scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([-0.5, 10.5])

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
      .attr("y1", function(d){return(y(Math.max(0, d.value.min)))})
      .attr("y2", function(d){return(y(Math.min(10, d.value.max)))})
      .attr("stroke", "blue")
      .style("width", 40)

      var boxWidth = 20
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.q3))})
        .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
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
    .attr("y1", function(d){return(y(d.value.median))})
    .attr("y2", function(d){return(y(d.value.median))})
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

function initialize(data) {
  fetch(`/graph1_fetch_data`)
    .then(response => response.json())
    .then(data => {
      graph1_data = convertToObject(data.result);
      console.log(graph1_data);
      render_plot_1_options();
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