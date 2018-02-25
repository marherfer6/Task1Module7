# Task1Module7
Display a barchart (start from barchart refactor sample):        
 -  Adding space between columns.    
 -  Adding colors to each bar.   
 -  Adding a legend.    
 -  Showing the chart vertically.

# Steps

- First let's create the basic HTML.

_./index.html_

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
  </body>
  <link rel="stylesheet" href="./styles.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.5.0/d3.min.js" charset="utf-8"></script>
  <script src="./data.js"></script>
  <script src="./main.js"></script>
</html>
```

- Let's add the sales data.

_./data.js_

```javascript
var totalSales = [
{ product: 'Hoodie', sales: 7 },
{ product: 'Jacket', sales: 6 },
{ product: 'Snuggie', sales: 9 },
];
```

- Let's calculate the size of the new chart and add some margins

_./main.js_

```javascript
function setupCanvasSize() {
  margin = {top: 10, left: 80, bottom: 20, right: 30};
  width = 400 - margin.left - margin.right;
  height = 400 - margin.top - margin.bottom;
}
```

- Let's add the SVG element with the given new width and height, and translate the origins applying the margins.

_./main.js_

```javascript
function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);

}
```

- Now on the X axis we don't have a linear range of values, we have a discrete range of values (one per product). Here we are generating an array of product names.

_./main.js_

```javascript
function setupXScale()
{
  x = d3.scaleBand()
    .rangeRound([0, width])
    .domain(totalSales.map(function(d, i) {
      return d.product;
    }));
}
```

- Now on the Y axis we want to map totalSales values to pixels in this case we map the canvas range height..0, to 0...maxSales domain == data (data from 0 to maxSales) boundaries.

_./main.js_

```javascript
function setupYScale()
{
  var maxSales = d3.max(totalSales, function(d, i) {
    return d.sales;
  });

  y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, maxSales]);

}
```

- Let's add the X and Y axis.

_./main.js_

```javascript
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
```


- Now it's time to append the barchart

_./main.js_

```javascript
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
```


- And finally, it´s time to add the legend.

_./main.js_

```javascript
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
    ```
        

