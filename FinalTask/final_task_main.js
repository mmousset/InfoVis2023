class barChart {

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
        let marginLabels = 50;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        self.chart = self.svg.append('g')
            .attr('transform',
                `translate(${self.config.margin.left + marginLabels}, ${self.config.margin.top})`);
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right - self.config.margin.left - marginLabels;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom - self.config.margin.top;

        self.xscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.value)])
            .range([0, self.inner_width]);
        self.yscale = d3.scaleBand()
            .domain(self.data.map(d => d.label))
            .range([0, self.inner_height])
            .paddingInner(0.1);

        self.xaxis = d3.axisBottom(self.xscale);
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        self.yaxis = d3.axisLeft(self.yscale);
        self.yaxis_group = self.chart.append('g');

    }

    update() {
        let self = this;

        const xmin = 0;
        const xmax = d3.max(self.data, d => d.value);
        self.xscale.domain([xmin, xmax]);

        self.yscale.domain(self.data.map(d => d.label));

        self.render();

    }

    render() {
        let self = this;

        self.chart.selectAll("rect").data(self.data)
            .join("rect")
            .transition()
            .duration(1000)
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());
        self.xaxis_group
            .call(self.xaxis);
        self.yaxis_group
            .call(self.yaxis);
    }

}


d3.csv("ds_salaries.csv")
    .then(data => {
        // Convert columns to appropriate types
        data.forEach(d => {
            d.salary_in_usd = +d.salary_in_usd; // convert string to number
        });
    
        // For the bar chart, you can use d3.nest() to group data by experience_level
        let experienceData = d3.nest()
            .key(d => { return d.experience_level; })
            .rollup(v => { return v.length; }) // count number of people per experience level
            .entries(data);
    
        // For the salary distribution graph, you can filter data based on clicked experience level
        let salaryData = data.filter(d => { return d.experience_level === clickedExperienceLevel; });
    
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 256,
            margin: { top: 10, right: 10, bottom: 10, left: 10 }
        };
        const bar_chart = new barChart(config, data);
        bar_chart.update();
    })
    .catch(error => { console.log(error); });