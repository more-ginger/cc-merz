const width = 960;
const height = 500;
const margin = 5;
const padding = 5;
const adj = 30;
// we are appending SVG first
const svg = d3.select("div#chart-container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-"
        + adj + " -"
        + adj + " "
        + (width + adj * 3) + " "
        + (height + adj * 3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content", true);



// Data preparation

const timeConv = d3.timeParse("%d-%b-%Y");
const dataset = d3.csv("data.csv");
dataset.then(function (data) {
    // console.log(data)

    // Build a single line dataset
    const singleLineData = data.map(function (d) {
        return {
            date: timeConv(d.date),
            value: +d.A
        }
    })

    // console.log(singleLineData)

    const xScale = d3.scaleTime().range([0, width])
    xScale.domain(d3.extent(singleLineData, function (d) { return d.date }))

    const yScale = d3.scaleLinear().range([height, 0])
    yScale.domain([0, d3.max(singleLineData.map(d => { return d.value }))])


    const yaxis = d3.axisLeft().scale(yScale);
    const xaxis = d3.axisBottom().scale(xScale);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);

    svg.append("g")
        .attr("class", "axis")
        .call(yaxis);

    const line = d3.line()
        .x(function (d) { return xScale(d.date) })
        .y(function (d) { return yScale(d.value) })


    svg.append("g")
        .attr("class", "line")
        .selectAll("line")
        .data(singleLineData)
        .enter()
        .append("path")
        .attr("d", function (d) { return line(singleLineData) })

})