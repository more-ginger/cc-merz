// Step 1: set up the scrollama functions and the basic structure of the D3 chart
const margin = { top: 20, right: 20, bottom: 40, left: 40 }
const width = 400 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const svgGroup = d3.select("#chart")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Step 2: Prepare the data
const data = [
    { year: 2010, value: 10 },
    { year: 2011, value: 34 },
    { year: 2012, value: 50 },
    { year: 2013, value: 1 },
    { year: 2014, value: 7 }
]

const newData = [
    { year: 2010, value: 10 },
    { year: 2011, value: 34 },
    { year: 2012, value: 50 },
    { year: 2013, value: 1 },
    { year: 2014, value: 7 },
    { year: 2015, value: 10 },
    { year: 2016, value: 15 },
    { year: 2017, value: 45 }
]

// Step 3: Create the scales for the chart
const xScale = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, width])
const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([height, 0])


// Step 4: Create the axes
const xAxis = d3.axisBottom(xScale).ticks(5);
const yAxis = d3.axisLeft(yScale).ticks(5);


svgGroup.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)

svgGroup.append("g")
    .attr("class", 'y-axis')
    .call(yAxis)

// Step 5: Create the linechart

const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.value))


svgGroup.append("path")
    .datum(data)
    .attr("d", line)
    .attr("class", 'data-line')
    .attr("stroke", "blue")
    .attr("stroke-width", 2)


const scroller = scrollama();

function handleStepEnter(response) {
    const { index } = response;
    console.log(index)

    if (index === 1) {
        svgGroup.select(".data-line")
            .attr("stroke", "red")
    }
}

function handleStepExit(response) {
    const { index } = response;

}

function init() {
    scroller
        .setup({
            step: ".step",
            offset: 0.7,
            progress: true,
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);

    window.addEventListener("resize", scroller.resize);
}

init();



// Step 6: Define the scrollama steps and implement changes to the chart