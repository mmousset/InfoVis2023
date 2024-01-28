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
        let marginTicks = 20;
        let marginCharts = 50;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        self.chart = self.svg.append('g')
            .attr('transform',
                `translate(${self.config.margin.left + self.config.width/2 + marginTicks}, ${self.config.margin.top})`);
        self.inner_width = self.config.width/2 - self.config.margin.left - self.config.margin.right - marginTicks - marginCharts;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom - self.config.margin.top;

        self.xscale = d3.scaleBand()
            .domain(self.data.experience_data.map(d => d.key))
            .range([0, self.inner_width])
            .paddingInner(0.1);

        self.yscale = d3.scaleLinear()
            .domain([0, d3.max(self.data.experience_data, d => d.value)])
            .range([0, self.inner_height]);

        self.xaxis = d3.axisBottom(self.xscale);
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);
        self.yaxis = d3.axisLeft(self.yscale);
        self.yaxis_group = self.chart.append('g');
    }

    update() {
        let self = this;

        self.xscale.domain(self.data.experience_data.map(d => d.key));

        const ymin = 0;
        const ymax = d3.max(self.data.experience_data, d => d.value);
        self.yscale.domain([ymax, ymin]);

        self.render();

    }

    render() {
        let self = this;

        self.chart.selectAll("rect").data(self.data.experience_data)
            .join("rect")
            .on("click", function (event, d) {
                // Update clickedExperienceLevel with the clicked experience level
                clickedExperienceLevel = d.key;
                // Code to update the salary distribution graph
            })
            .transition()
            .duration(1000)
            .attr("x", d => { return self.xscale(d.key) })
            .attr("y", d => { return self.yscale(d.value) })
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => self.inner_height - self.yscale(d.value)); // Corrected height


        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }
}


d3.csv("https://mmousset.github.io/InfoVis2023/FinalTask/ds_salaries.csv")
    .then(data => {

        // Convert columns to appropriate types
        data.forEach(d => {
            d.salary_in_usd = +d.salary_in_usd; // convert string to number
        });


        let clickedExperienceLevel;

        // For the bar chart, you can use d3.nest() to group data by experience_level
        let experience_data = Array.from(d3.rollup(data, v => v.length, d => d.experience_level), ([key, value]) => ({ key, value }));
        data.experience_data = experience_data;

        // For the salary distribution graph, you can filter data based on clicked experience level
        let salary_data = data.filter(d => { return d.experience_level === clickedExperienceLevel; });

        var config = {
            parent: '#drawing_region',
            width: 1024,
            height: 512,
            margin: { top: 20, right: 20, bottom: 20, left: 20 }
        };
        const bar_chart = new barChart(config, data);
        bar_chart.update();

    })
    .catch(error => { console.log(error); });