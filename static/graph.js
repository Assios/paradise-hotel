let width = 1000;
let height = 700;
const m = () => Math.random();

const data = [
	{
		"id": 0,
		"name": "Sophie Vågsæther",
		"url": "http://lol.tv3.no/julius",
		"sex": [2, 3],
		"notsex": [],
		"picture": '/static/img/sophie.png'
	},
	{
		"id": 1,
		"name": "Martine Johansen",
		"url": "http://lol.tv3.no/kornelius",
		"sex": [2],
		"notsex": [3],
		"picture": '/static/img/sophie.png'
	},
	{
		"id": 2,
		"name": "Aleksander Sæterstøl",
		"url": "http://lol.tv3.no/kornelius",
		"sex": [],
		"notsex": [],
		"picture": '/static/img/sophie.png'
	},
	{
		"id": 3,
		"name": "Grunde Myhrer",
		"url": "http://lol.tv3.no/kornelius",
		"sex": [],
		"notsex": [],
		"picture": '/static/img/sophie.png'
	},
];

let nodes = [];
let edges = [];

for (let i = 0; i < data.length; i++) {
	nodes.push({x: m(), y: m(), name: data[i].name, picture: data[i].picture});

	for (let j = 0; j < data[i].sex.length; j++) {
		edges.push({source: data[i].id, target: data[i].sex[j], type: 'sex'});
	}

	for (let j = 0; j < data[i].notsex.length; j++) {
		edges.push({source: data[i].id, target: data[i].notsex[j], type: 'notsex'});
	}
}

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

let radius = width/18

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
		const p = $(this).context.__data__;

		$('#myModal').modal();
		$('.modal-title').text(p.name);
	});


function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
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
		.style('font-size', '1.5rem')

	edge.attr('x1', d => d.source.x)
		.attr('y1', d => d.source.y)
		.attr('x2', d => d.target.x)
		.attr('y2', d => d.target.y)
};

force.on("tick", tick);

force.start();