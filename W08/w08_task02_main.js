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
        let marginTicks = 20;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        self.chart = self.svg.append('g')
            .attr('transform',
                `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right - marginTicks;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom - self.config.margin.top;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);
        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height]);

        self.xaxis = d3.axisBottom(self.xscale);
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(20, ${self.inner_height})`);
        self.yaxis = d3.axisLeft(self.yscale);
        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(20, 0)`);

    }

    update() {
        let self = this;

        const xmin = d3.min(self.data, d => d.x);
        const xmax = d3.max(self.data, d => d.x);
        self.xscale.domain([xmin, xmax]);
        const ymin = d3.min(self.data, d => d.y);
        const ymax = d3.max(self.data, d => d.y);
        self.yscale.domain([ymax, ymin]);
        self.render();
    }

    render() {
        let self = this;

        const line = d3.line()
            .x(d => self.xscale(d.x))
            .y(d => self.yscale(d.y));

        const area = d3.area()
            .x(d => self.xscale(d.x))
            .y1(d => self.yscale(d.y))
            .y0( d3.max(self.data, d => self.yscale(d.y)) + 10 );

        self.chart.append('path')
            .attr('d', line(self.data))
            .attr('d', area(self.data))
            .attr('stroke', 'red')
            .attr('fill', 'black')
            .attr('transform',
                `translate(20, 0)`);
        self.xaxis_group
            .call(self.xaxis);
        self.yaxis_group
            .call(self.yaxis);
    }

}

d3.csv("https://mmousset.github.io/InfoVis2023/W08/data2.csv")
    .then(data => {
        data.forEach(d => { d.x = +d.x; d.y = +d.y; });
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: { top: 10, right: 10, bottom: 10, left: 10 }
        };
        const line_chart = new lineChart(config, data);
        line_chart.update();
    })
    .catch(error => { console.log(error); });    