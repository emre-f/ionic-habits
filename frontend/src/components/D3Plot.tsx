import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
    date: Date;
    value: number;
}

interface Props {
    data: DataPoint[];
}

const D3Plot: React.FC<Props> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Sort data in ascending order of its date
        data.sort((a, b) => a.date.getTime() - b.date.getTime());

        if (containerRef.current) {
            const container = d3.select(containerRef.current);

            // Set up dimensions
            const width = 750;
            const height = 325;
            const margin = { top: 30, right: 30, bottom: 50, left: 50 };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            // Set up scales
            const earliestDate = d3.min(data, (d) => d.date) as Date;
            const latestDate = d3.max(data, (d) => d.date) as Date;
            const timeDiff = latestDate.getTime() - earliestDate.getTime();
            var variableTimeBuffer = 0.1; // Smaller values might not change anything because x-axis will be increment with months for ex.
            const variableTimeDiff = timeDiff * variableTimeBuffer;

            const xScale = d3
                .scaleTime()
                .domain([
                    new Date(earliestDate.getTime() - variableTimeDiff), 
                    new Date(latestDate.getTime() + variableTimeDiff)
                ])
                .range([0, innerWidth])
                .nice();

            const yScale = d3
                .scaleLinear()
                .domain([
                    0,
                    d3.max(data, (d) => d.value)! * (1 + variableTimeBuffer), // 10% above the highest value
                ])
                .nice()
                .range([innerHeight, 0]);

            // Set up axes
            const xAxis = d3.axisBottom(xScale).ticks(5);
            const yAxis = d3.axisLeft(yScale);

            // Set up line generator
            const line = d3
                .line<DataPoint>()
                .x((d) => xScale(d.date))
                .y((d) => yScale(d.value))
                .curve(d3.curveLinear);

            // Add SVG element
            const svg = container
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            // Add background rectangle
            svg
                .append('rect')
                .attr('x', margin.left)
                .attr('y', margin.top)
                .attr('width', innerWidth)
                .attr('height', innerHeight)
                .attr('fill', '#303030');

            // Add path element
            svg
                .append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', 'cyan')
                .attr('stroke-width', 2)
                .attr('transform', `translate(${margin.left}, ${margin.top})`)
                .attr('d', line);

            // Add data points
            const dataPoints = svg
                .selectAll('.data-point')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'data-point')
                .attr('cx', (d) => xScale(d.date))
                .attr('cy', (d) => yScale(d.value))
                .attr('r', 4)
                .attr('fill', 'cyan')
                .attr('transform', `translate(${margin.left}, ${margin.top})`)
                .on('mouseover', (event, d) => {
                    // Create tooltip element
                    const tooltip = container.append('div');

                    // Add date and value text to tooltip element
                    tooltip.append('span')
                        .attr('class', 'cyan-text')
                        .text('Date: ');
                    tooltip.append('span')
                        .text(d3.timeFormat('%b %d, %Y')(d.date))
                        .style('white-space', 'nowrap');
                    tooltip.append('br');
                    tooltip.append('span')
                        .attr('class', 'cyan-text')
                        .text('Value: ');
                    tooltip.append('span')
                        .text(d.value)
                        .style('white-space', 'nowrap');

                    tooltip
                        .attr('class', 'tooltip')
                        .style('left', `${event.pageX - (tooltip.node()?.offsetWidth ?? 0) / 2}px`)
                        .style('top', `${event.pageY - (tooltip.node()?.offsetHeight ?? 0) - 5}px`);
                })               
                .on('mouseout', () => {
                    container.selectAll('.tooltip').remove();
                });

            dataPoints
                .data(data)
                .attr('cx', (d) => xScale(d.date))
                .attr('cy', (d) => yScale(d.value));

            // Add axes elements
            svg
                .append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(${margin.left},${innerHeight + margin.top})`)
                .call(xAxis);

            svg
                .append('g')
                .attr('class', 'y-axis')
                .attr('transform', `translate(${margin.left},${margin.top})`)
                .call(yAxis);

            // Style axes
            container.selectAll('.domain').attr('stroke', 'white');
            container.selectAll('.tick line').attr('stroke', 'white');
            container.selectAll('.tick text').attr('fill', 'white');

            // Clean up
            return () => {
                svg.remove();
            };
        }
    }, [data]);

    return <div ref={containerRef}  />;
};

export default D3Plot;