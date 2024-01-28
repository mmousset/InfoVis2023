let multi_bar_chart;
let pie_chart;
let input_data;

d3.csv("https://mmousset.github.io/InfoVis2023/FinalTask/ds_salaries.csv")
    .then(data => {
        input_data = data;
        data.forEach(function(d) {
            d.work_year = +d.work_year; // convert string to number
            for (i in self.subgroups) {
                d[self.subgroups[i]] = +d[self.subgroups[i]]
            }
        });

        let experience_data = Array.from(d3.rollup(data, v => v.length, d => d.experience_level), ([key, value]) => ({ key, value }));
        input_data.experience_data = experience_data;

        var config_multiBarChart = {
            parent: '#drawing_region_multiBarChart',
            width: 512,
            height: 256,
            margin: { top: 20, right: 20, bottom: 20, left: 20 }
        };
        
        multi_bar_chart = new multiBarChart(config_multiBarChart, input_data);
        multi_bar_chart.update();

        var config_pieChart = {
            parent: '#drawing_region_pieChart',
            width: 512,
            height: 256,
            margin: { top: 20, right: 20, bottom: 20, left: 20 }
        };

        pie_chart = new pieChart(config_pieChart, input_data);
        pie_chart.update();
    })
    .catch(error => { console.log(error); });