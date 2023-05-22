// Step 1: Set up the basic structure
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const width = 400 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Step 2: Prepare the data
const data = [
    { year: 2010, value: 10 },
    { year: 2011, value: 20 },
    { year: 2012, value: 15 },
    { year: 2013, value: 25 },
    { year: 2014, value: 18 },
];

const newData = [
    { year: 2010, value: 10 },
    { year: 2011, value: 20 },
    { year: 2012, value: 15 },
    { year: 2013, value: 25 },
    { year: 2014, value: 18 },
    { year: 2015, value: 12 },
    { year: 2016, value: 17 },
    { year: 2017, value: 22 },
];

// Step 3: Create the scales
const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height, 0]);

// Step 4: Create the axes
const xAxis = d3.axisBottom(xScale).ticks(5);
const yAxis = d3.axisLeft(yScale).ticks(5);

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

// Step 5: Create the line chart
const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.value));

svg.append("path")
    .datum(data)
    .attr("d", line)
    .attr("class", 'data-line')
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2);

// Step 6: Initialize Scrollama
const scroller = scrollama();

function handleStepEnter(response) {
    const { index } = response;

    // Step 7: Define Scrollama steps
    if (index === 1) {
        // Update chart color to red
        svg.select(".data-line")
            .attr("stroke", "red");
    }

    if (index === 2) {
        // Update x-axis labels
        // Update the xScale and yScale domains with the new data
        xScale.domain(d3.extent(newData, d => d.year));
        yScale.domain([0, d3.max(newData, d => d.value)]);

        // Update the line with the new data
        svg.select(".data-line")
            .datum(newData)
            .attr("d", line);

        // Update the x-axis and y-axis
        svg.select(".x-axis")
            .call(xAxis);

        svg.select(".y-axis")
            .call(yAxis);
    }
}

function handleStepExit(response) {
    const { index } = response;
    // Step 7: Define Scrollama steps (reversed)
    if (index > 1) {
        // Reverse the chart color change
        svg.select(".data-line")
            .attr("stroke", "blue");
    }

    if (index < 2) {
        // Update the xScale and yScale domains with the original data
        xScale.domain(d3.extent(data, d => d.year));
        yScale.domain([0, d3.max(data, d => d.value)]);

        // Update the line with the original data
        svg.select(".data-line")
            .datum(data)
            .attr("d", line);

        // Update the x-axis and y-axis
        svg.select(".x-axis")
            .call(xAxis);

        svg.select(".y-axis")
            .call(yAxis);
    }
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
