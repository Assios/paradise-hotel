const d3 = require('d3');
const data = require('../data-example.json');

let width = window.innerWidth;
let height = window.innerHeight;
const m = () => Math.random();

let edges = [];

for (let i = 0; i < data.length; i++) {

	for (let j = 0; j < data[i].sex.length; j++) {
		edges.push({source: data[i].id, target: data[i].sex[j], type: 'sex'});
	}

	for (let j = 0; j < data[i].notsex.length; j++) {
		edges.push({source: data[i].id, target: data[i].notsex[j], type: 'notsex'});
	}
}

const createNodes = (data, radius, width) => {
	let nodes = [];

	for (let i = 0; i < data.length; i++) {
		const angle = (i / (data.length/2)) * Math.PI;
        const x = (radius * Math.cos(angle)) + (width/10);
		const y = (radius * Math.sin(angle)) + (width/10);

		nodes.push(
			{
				x: x,
				y: y,
				name: data[i].name,
				picture: data[i].picture,
				age: data[i].age,
				home: data[i].home
			}
			);
	}
	return nodes;
};

const nodes = createNodes(data, 1000, width);

let force = d3.layout.force()
	.size([width, height])
	.nodes(nodes)
	.links(edges)
	.linkDistance(width/2)
	.linkStrength(0.2)
	.charge(-1200)

let svg = d3.select('main').append('svg')
	.attr('width', width)
	.attr('height', height)

let notSexColor = '#7A9B76'
let sexColor = '#F7B1AB'

let edge = svg.selectAll('.link')
	.data(edges)
	.enter()
	.append('line')
	.attr('class', 'link')
	.style('stroke', d => {
		if (d.type === 'sex') {
			return sexColor
		} else {
			return notSexColor
		}
	})
	.style('stroke-width', d => "5px")

function dragstart(d, i) {
    force.stop();
}

function dragmove(d, i) {
    d.px += d3.event.dx;
    d.py += d3.event.dy;
    d.x += d3.event.dx;
    d.y += d3.event.dy;
    tick();
}

function dragend(d, i) {
    d.fixed = true;
    tick();
    force.resume();
}

let radius = Math.floor(width/(data.length*2.3));

let node_drag = d3.behavior.drag()
    .on("dragstart", dragstart)
    .on("drag", dragmove)
    .on("dragend", dragend);

let node = svg.selectAll('.node')
	.data(nodes)
	.enter()
	.append('g')
    .call(node_drag);

let circle = node.append('circle')
	.attr('class', 'node')
	.style('stroke', d => '#ccc')
	.style('stroke-width', d => '10px')

let clip = node.append('clipPath')
	.attr('id', (d,i) => 'clip' + i)
	.append('circle')
	.attr('cx', 2*radius)
	.attr('cy', 2*radius)
	.attr('r', 2*radius)

let image = node.append("svg:image")
    .attr("xlink:href", d => d.picture)
    .attr("width", 2*radius)
    .attr("height", 2*radius)
    .attr("x", 0)
    .attr("y", 0)
	.on("click", function() {
		if (d3.event.defaultPrevented) return;
		p = $(this)[0].__data__;

		$('#modal').modal();
		$('.modal-title').text(p.name);
		$('.age').text(p.age);
        $('.home').text(p.home);
	});


function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, 1, 1, end.x, end.y
    ].join(" ");
    return d;       
}

var arcs = node.append("path")
    .attr("fill","none")
    .attr("id", function(d,i){return "s"+i;})

var arcPaths = node.append("g")
    .style("fill","navy");
var text = arcPaths.append("text")
    .attr("font-size",10)
    .style("text-anchor","middle")
    .append("textPath")
    .attr("xlink:href",function(d,i){return "#s"+i;})
    .attr("startOffset",function(d,i){return "50%";})
    .text(function(d){return d.name.toUpperCase();})


function tick() {
	circle.attr('r', radius)
		.attr('cx', d => d.x)
		.attr('cy', d => d.y)
		.style('fill', 'url(#image)')

	clip.attr('r', radius)
		.attr('cx', d => d.x)
		.attr('cy', d => d.y)
		.style('fill', 'url(#image)')

	image.attr('x', function(d) {
			return d.x - this.getBBox().width/2
		})
		.attr('y', function(d) {
			return d.y - this.getBBox().height/2
		})
		.style('fill', 'black')
		.attr('clip-path', (d,i) => 'url(#clip' + i + ')')

	arcs.attr("d", function(d,i) {
        return describeArc(d.x, d.y, radius*1.2, 160, -160)
    });

	text.style('fill', 'white')
		.style('font-size', '1.4rem')

	edge.attr('x1', d => d.source.x)
		.attr('y1', d => d.source.y)
		.attr('x2', d => d.target.x)
		.attr('y2', d => d.target.y)
};

force.on("tick", tick);

force.start();
