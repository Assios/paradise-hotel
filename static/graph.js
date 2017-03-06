let width = 800;
let height = 500;
const m = () => Math.random();

const data = [
	{
		"id": 0,
		"name": "Julius Cæsar",
		"url": "http://lol.tv3.no/julius",
		"sex": [1, 2],
		"notsex": []
	},
	{
		"id": 1,
		"name": "Kornelius Kvakk",
		"url": "http://lol.tv3.no/kornelius",
		"sex": [],
		"notsex": []
	},
	{
		"id": 2,
		"name": "Johnny Cash",
		"url": "http://lol.tv3.no/kornelius",
		"sex": [],
		"notsex": [0]
	}
];

let nodes = [];
let edges = [];

for (let i = 0; i < data.length; i++) {
	nodes.push({x: m(), y: m(), name: data[i].name});

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
	.style('fill', d => 'white')

let text = node.append('text')
	.attr('class', 'node-label')
	.text(d => d.name)

function tick() {
	let radius = width/18
	circle.attr('r', radius)
		.attr('cx', d => d.x)
		.attr('cy', d => d.y)

	text.attr('x', function(d) {
			return d.x - this.getBBox().width/2
		})
		.attr('y', function(d) {
			return d.y + this.getBBox().height/4
		})
		.style('fill', 'black')

	edge.attr('x1', d => d.source.x)
		.attr('y1', d => d.source.y)
		.attr('x2', d => d.target.x)
		.attr('y2', d => d.target.y)
};

force.on("tick", tick);

force.start()