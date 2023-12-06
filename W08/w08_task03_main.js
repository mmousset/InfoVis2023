class PieChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            radius: config.radius || 40
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`);
    }

    update() {
        let self = this;

        const pie = d3.pie()
            .value(d => d.value);
        const arc = d3.arc()
            .innerRadius(self.config.radius / 2)
            .outerRadius(self.config.radius);

            let pieChart = self.chart.selectAll('pie')
            .data(pie(self.data))
            .enter()
            .append('g');
    
        pieChart.append('path')
            .attr('d', arc)
            .attr('fill', 'black')
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        pieChart.append('text')
            .attr('transform', function (d) { return 'translate(' + arc.centroid(d) + ')'; })
            .attr('dy', '0.35em')
            .style('text-anchor', 'middle')
            .style('fill', 'white')
            .text(d => d.data.label);
    }

}

d3.csv("https://mmousset.github.io/InfoVis2023/W08/data.csv")
    .then(data => {
        data.forEach(d => { d.value = +d.value; });
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
            radius: 100
        };
        const pie_chart = new PieChart(config, data);
        pie_chart.update();
    })
    .catch(error => { console.log(error); });