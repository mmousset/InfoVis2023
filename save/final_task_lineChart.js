class lineChart {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 }
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;
        let marginTicks = 30;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left + marginTicks}, ${self.config.margin.top})`);
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right - marginTicks;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scalePoint()
            .range([0, self.inner_width])
            .padding(0.5);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.colorScale = d3.scaleOrdinal(d3.schemeCategory10);  // Add this line

        self.xaxis = d3.axisBottom(self.xscale);
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        self.yaxis = d3.axisLeft(self.yscale)
            .tickFormat(d3.format(".0f"));  // 
        self.yaxis_group = self.chart.append('g');
    }


    update() {
        let self = this;

        // Group data by experience_level and work_year
        self.nestedData = Array.from(d3.group(self.data, d => d.experience_level),
            ([key, value]) => ({
                key, values: Array.from(d3.group(value, d => d.work_year),
                    ([k, v]) => ({ work_year: k, salary: d3.mean(v, d => d.salary_in_usd) }))
            }));

        self.xscale.domain([...new Set(self.data.map(d => d.work_year))].sort(d3.ascending));
        self.yscale.domain([0, d3.max(self.nestedData, d => d3.max(d.values, e => e.salary))]);

        self.render();
    }



    render() {
        let self = this;

        // Define the line
        var valueline = d3.line()
            .x(function (d) { return self.xscale(d.work_year); })
            .y(function (d) { return self.yscale(d.salary); });

        // Add the valueline path for each experience_level.
        self.nestedData.forEach(function (d, i) {
            var group = self.chart.append('g');  // Append a 'g' element for each group

            group.append("path")
                .datum(d.values)
                .attr("class", "line")
                .attr("d", valueline)
                .attr("fill", "none")
                .attr("stroke", self.colorScale(d.key))  // Use the color scale here
                .attr("stroke-width", 1.5);

            // Add points for each data point
            group.selectAll(".dot")
                .data(d.values)
                .enter().append("circle")  // Append circle elements
                .attr("class", "dot")  // Assign a class for styling
                .attr("cx", function (d) { return self.xscale(d.work_year); })
                .attr("cy", function (d) { return self.yscale(d.salary); })
                .attr("r", 5)  // Size of the points
                .attr("fill", self.colorScale(d.key));  // Use the color scale here

            // Add legend
            self.svg.append("text")
                .attr("x", self.config.width - 50)
                .attr("y", 30 + (i * 20))
                .attr("class", "legend")
                .style("fill", self.colorScale(d.key))
                .text(d.key);
        });

        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }




}

d3.csv("https://mmousset.github.io/InfoVis2023/FinalTask/ds_salaries.csv")
    .then(data => {
        // Convert columns to appropriate types
        data.forEach(d => {
            d.salary_in_usd = +d.salary_in_usd; // convert string to number
            d.work_year = +d.work_year; // convert string to number
        });

        var config = {
            parent: '#drawing_region_lineChart',
            width: 512,
            height: 256,
            margin: { top: 20, right: 20, bottom: 20, left: 20 }
        };
        const line_chart = new lineChart(config, data);
        line_chart.update();
    })
    .catch(error => { console.log(error); });
