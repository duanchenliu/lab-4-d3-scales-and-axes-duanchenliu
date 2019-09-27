
// SVG Size
var width = 700,
	height = 500;
let padding = 30;


// Load CSV file

d3.csv("data/wealth-health-2014.csv", (row)=>{
	// type conversion
	return{
		...row,
		LifeExpectancy:+row.LifeExpectancy,
		Income:+row.Income,
		Population:+row.Population
	};
})
.then(data=>{
		// Analyze the dataset in the web console
		console.log(data);
		console.log("Countries: " + data.length);
		let newArray=data;
		newArray.sort(function (a, b) {
			return b.Population - a.Population;
		});
		let margin = {top:20, bottom:20, left:10, right:20};
		width = 960 - margin.left - margin.right;
		height = 500 - margin.top - margin.bottom;
		let outerWidth = 400;
        let outerHeight = 400;
  		// let width = outerWidth - margin.left - margin.right;
  		// let height = outerHeight - margin.top - margin.bottom;
		// let incomeMin = d3.min(data, d=>d.Income);
		let incomeMin = d3.min(data, function(d){ return d.Income }) - 100;
		let incomeMax = d3.max(data, function(d){ return d.Income }) + 100;
		// let incomeMax = d3.max(data, d=>d.Income);
		// let lifeMin = d3.min(data, d=>d.LifeExpectancy);
		let lifeMin = d3.min(data, function(d){ return d.LifeExpectancy }) - 5;
		let lifeMax = d3.max(data, function(d){ return d.LifeExpectancy }) + 5;
		// let lifeMax = d3.max(data,d=>d.LifeExpectancy);
		let populationMin = d3.min(data, d=>d.Population);
		let populationMax = d3.max(data, d=>d.Population);

		let svg = d3.select('#chart-area').append('svg')
       				.attr('width', width + margin.left + margin.right) 
					.attr('height', height + margin.top + margin.bottom)
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// let g = svg.append('g');
					// .attr('transform', `translate(${margin.top}, ${margin.left})`);
				  
		let incomeScale = d3.scaleLog()
					.domain([incomeMin, incomeMax])
					.range([padding, width - padding]);

		let lifeExpectancyScale = d3.scaleLinear()
					.domain([lifeMin, lifeMax])
					.range([height-padding,padding]);

		let populationScale = d3.scaleLinear()
					.domain([populationMin,populationMax])
					.range([4, 30]);

		let colorPalette = d3.scaleOrdinal(d3.schemeSet3)
					.domain([newArray.Region]);


		

		let xaxis = d3.axisBottom()
					.tickValues([1000, 2000, 4000, 8000, 16000, 32000, 100000])
					.tickFormat(d3.format("1000"))
					.scale(incomeScale);

		let yaxis = d3.axisLeft()
					.ticks(9)
					.scale(lifeExpectancyScale);
		
		svg.append('g')
					.attr('class', 'x-axis axis')
					// .attr('transform', `translate(${0}, ${height-20})`)
					.attr("transform", "translate(0," + (height - padding) + ")")
					.call(xaxis);	
		
		svg.append('g')
					.attr('class', 'y-axis axis')
					.attr("transform", "translate(" + padding + ",0)")
					.call(yaxis);


		svg.selectAll("circle")
					.data(newArray)
					.enter()
					.append("circle")
					// .attr("fill", "turquoise")
					.attr("fill", (d)=>colorPalette(d.Region))
				// 	.attr("r", function(d, index){
				// 		if (d.population<1000000){
				// 			return 4;
				// 		}else{
				// 			return 8;
				// 		}
				// 	})
				   .attr("stroke", "Black")
				   .attr("r", (d)=>populationScale(d.Population))
				   .attr("cx", (d)=>incomeScale(d.Income))
				   .attr("cy", (d)=>lifeExpectancyScale(d.LifeExpectancy));

		svg.append('text')
					.attr("x", 700)
					.attr("y", 420)	 
					.text("Income per Person (GDP per Capita)");

		svg.append('text')
					.attr("transform", "rotate(-90)")
					.attr("x", -30)
					.attr("text-anchor", "end")
					.attr("y", 50)
					// .attr("dy", ".75em")
					.text("Life Expectancy");	


	   console.log(incomeScale(5000));
	   console.log(lifeExpectancyScale(68));
});