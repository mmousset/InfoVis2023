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
        self.yscale = d3.scaleBand()
            .domain(self.data.map(d => d.label))
            .range([0, self.inner_height])
            .paddingInner(0.1);
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

d3.csv("https://mmousset.github.io/InfoVis2023/W08/data.csv")
    .then(data => {
        data.forEach(d => { d.value = +d.value; });
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 256,
            margin: { top: 10, right: 10, bottom: 10, left: 10 }
        };
        const bar_chart = new barChart(config, data);
        bar_chart.update();

        d3.select('#reverse')
            .on('click', d => {
                data.reverse();
                bar_chart.update();
            });
    })
    .catch(error => { console.log(error); });
