
// Let's start using ES6
// And let's organize the code following clean code concepts


var barColor = d3.scaleOrdinal(d3.schemeCategory20c);var barColor = d3.scaleOrdinal(d3.schemeCategory20c);

// Isolated data array to a different file

let margin = null,
    width = null,
    height = null;

let svg = null;
let x, y = null; // scales

setupCanvasSize();
appendSvg("body");
setupXScale();
setupYScale();
appendXAxis();
appendYAxis();
appendChartBars();
AppendLegend();

// Let's calculate the size of the new chart and add some margins
function setupCanvasSize() {
  margin = {top: 10, left: 80, bottom: 20, right: 30};
  width = 400 - margin.left - margin.right;
  height = 400 - margin.top - margin.bottom;
}

// Let's add the SVG element with the given new width and height, and translate the origins applying the margins.

function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);

}

// Now on the X axis we don't have a linear range of values, we have a discrete
// range of values (one per product)
// Here we are generating an array of product names
function setupXScale()
{
  x = d3.scaleBand()
    .rangeRound([0, width])
    .domain(totalSales.map(function(d, i) {
      return d.product;
    }));
}

// Now on the Y axis we want to map totalSales values to
// pixels
// in this case we map the canvas range height..0, to 0...maxSales
// domain == data (data from 0 to maxSales) boundaries
function setupYScale()
{
  var maxSales = d3.max(totalSales, function(d, i) {
    return d.sales;
  });

  y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, maxSales]);

}

function appendXAxis() {
  // Add the X Axis
  svg.append("g")
    .attr("transform",`translate(0, ${height})`)
    .call(d3.axisBottom(x));
}

function appendYAxis() {
  // Add the Y Axis
  svg.append("g")
  .call(d3.axisLeft(y));
}




function appendChartBars()
{
  // Now let's select all the rectangles inside that svg
  // (right now is empty)
  var rects = svg.selectAll('rect')
    .data(totalSales);

    // Now it's time to append to the list of Rectangles we already have
    var newRects = rects.enter();

    // Let's append a new Rectangles
    // UpperCorner:
    //    Starting x position, the start from the axis
    //    Starting y position, where the product starts on the y scale
    // React width and height:
    //    height: the space assign for each entry (product) on the Y axis
    //    width: Now that we have the mapping previously done (linear)
    //           we just pass the sales and use the X axis conversion to
    //           get the right value
    //var barColor = d3.scaleOrdinal(d3.schemeCategory20c);

    newRects.append('rect')
      .attr('x', function(d, i) {
        return x(d.product);
      })
      .attr('y', function(d) {
       return y(d.sales);
      })
      .attr('height', function(d, i) {
        return height - y(d.sales);
      })
      .attr('width', function(d,i) {
        return x.bandwidth() - 4
      })        
      .attr('fill', function(d)  {
        return barColor(d.product);
      });
    }

    function AppendLegend() {
        // building a legend is as simple as binding
        // more elements to the same data. in this case,
        // <text> tags

      svg.append('g')
        .attr("transform","translate(100,50)")
        .attr('class', 'legend')
          .selectAll('text')
          .data(totalSales)
            .enter()
              .append('text')
                .text(function(d) { return '• ' + d.product; })
                .attr('fill', function(d) { return barColor(d.product); })
                .attr('y', function(d, i) { return 20 * (i + 1); })  
      }

