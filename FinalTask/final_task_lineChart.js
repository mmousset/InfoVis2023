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
        self.inner_height = self.config.height - 2 * self.config.margin.top - 2 * self.config.margin.bottom;

        self.xscale = d3.scalePoint()
            .range([0, self.inner_width])
            .padding(0.5);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        self.xaxis = d3.axisBottom(self.xscale);
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        self.yaxis = d3.axisLeft(self.yscale)
            .tickFormat(d3.format(".0f"));
        self.yaxis_group = self.chart.append('g');
    }

    update() {
        let self = this;

        self.nestedData = Array.from(d3.group(self.data, d => d.work_year),
            ([key, value]) => ({
                key, values: { work_year: key, salary: d3.mean(value, d => d.salary_in_usd) }
            }));
            
        self.nestedData.sort((a, b) => d3.ascending(a.key, b.key));

        self.xscale.domain([...new Set(self.data.map(d => d.work_year))].sort(d3.ascending));
        self.yscale.domain([0, d3.max(self.nestedData, d => d.values.salary)]);

        self.render();
    }

    render() {
        let self = this;

        var valueline = d3.line()
            .x(function (d) { return self.xscale(d.values.work_year); })
            .y(function (d) { return self.yscale(d.values.salary); });

        self.chart.append("path")
            .datum(self.nestedData)
            .attr("class", "line")
            .attr("d", valueline)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5);

        self.chart.selectAll(".dot")
            .data(self.nestedData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function (d) { return self.xscale(d.values.work_year); })
            .attr("cy", function (d) { return self.yscale(d.values.salary); })
            .attr("r", 5)
            .attr("fill", "black");

        self.svg.append("text")
            .attr("x", self.config.width / 2)
            .attr("y", self.config.height - self.config.margin.bottom)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Salary Average through the Year and Experience Level");

        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }
}
