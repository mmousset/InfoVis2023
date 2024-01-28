class pieChart {

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

        self.radius = Math.min(self.config.width, self.config.height) / 2;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`);

        self.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        self.pie = d3.pie()
            .value(d => d.value);
        self.arc = d3.arc()
            .innerRadius(0)
            .outerRadius(self.radius);
    }

    update() {
        let self = this;
        self.render();
    }

    render() {
        let self = this;

        let pieData = self.pie(self.data.experience_data);
    
        let g = self.chart.selectAll('g')
            .data(pieData)
            .join('g');
    
        g.append('path')
            .attr('d', self.arc)
            .attr('fill', d => self.colorScale(d.data.key))
            .on('click', function(event, d) {
                // Filter the data for the bar chart based on the clicked arc
                let filteredData = self.data.filter(item => item.experience_level === d.data.key);
                
                // Update the bar chart with the filtered data
                multi_bar_chart.data = filteredData;
                multi_bar_chart.update();
            });
    
    
        // Add legend
        let legend = self.svg.selectAll('.legend')
            .data(pieData)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                return `translate(${50}, ${i * 20})`;
            });
    
        legend.append('rect')
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', d => self.colorScale(d.data.key));
    
        legend.append('text')
            .attr('x', 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .text(d => d.data.key);
    }
    
}
