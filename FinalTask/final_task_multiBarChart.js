class multiBarChart {
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
            .attr('transform',
                `translate(${self.config.margin.left + marginTicks}, ${self.config.margin.top})`);
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right - marginTicks;
        self.inner_height = self.config.height - 2*self.config.margin.top - 2*self.config.margin.bottom;

        self.xscale = d3.scaleBand()
            .range([self.inner_width, 0])
            .paddingInner(0.1);

        self.xSubgroup = d3.scaleBand()
            .padding(0.05);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.colorScale = d3.scaleOrdinal(d3.schemeCategory10);  // Add this line

        self.xaxis = d3.axisBottom(self.xscale);
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        self.yaxis = d3.axisLeft(self.yscale);
        self.yaxis_group = self.chart.append('g');
    }

    update() {
        let self = this;

        self.chart.selectAll('rect').remove();

        self.subgroups = [...new Set(self.data.map(d => d.experience_level))];  // Define subgroups here

        var groups = [...new Set(self.data.map(d => d.work_year))];

        var nestedData = Array.from(d3.group(self.data, d => d.work_year), ([key, values]) => {
            let valueMap = new Map(d3.rollup(values, v => d3.mean(v, d => d.salary_in_usd), d => d.experience_level));
            return { key, values: self.subgroups.map(name => valueMap.get(name) || 0) };
        });
        self.data.nestedData = nestedData;

        self.xscale.domain(groups);
        self.xSubgroup.domain(self.subgroups).range([0, self.xscale.bandwidth()]);  
        self.yscale.domain([0, d3.max(nestedData, d => d3.max(d.values))]);  
        self.render();
    }

    render() {
        let self = this;

        self.chart.append("g")
            .selectAll("g")
            .data(self.data.nestedData) 
            .join("g")
            .attr("transform", d => `translate(${self.xscale(d.key)}, 0)`)  
            .selectAll("rect")
            .data(function (d) {
                return d.values.map(function (value, i) {
                    return { key: self.subgroups[i], value: value };
                });
            }) 
            .join("rect")
            .attr("x", d => self.xSubgroup(d.key))
            .attr("y", d => self.yscale(d.value))
            .attr("width", self.xSubgroup.bandwidth())
            .attr("height", d => self.inner_height - self.yscale(d.value))
            .attr("fill", d => self.colorScale(d.key));

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