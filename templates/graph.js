let nodes = [
	{x: 0.1, y: 0.1},
	{x: 0.2, y: 0.2},
	{x: 0.1, y: 0.8}
]
let edges = [
	{source: 0, target: 1},
	{source: 0, target: 2}
]
let width = 800;
let height = 500;

let nodesAbsoluteLocations = nodes.map(el => ({x: el.x*width, y: el.y*height}))
console.log(nodesAbsoluteLocations)

let force = d3.layout.force()
	.size([width, height])
	.nodes(nodesAbsoluteLocations)
	.links(edges)
	.linkDistance(width/2)
	.linkStrength(0.2)
	.charge(-1000)

let svg = d3.select('body').append('svg')
	.attr('width', width)
	.attr('height', height)
console.log(d3.select('body'))

let edge = svg.selectAll('.link')
	.data(edges)
	.enter()
	.append('line')
	.attr('class', 'link')

let node = svg.selectAll('.node')
	.data(nodesAbsoluteLocations)
	.enter()
	.append('circle')
	.attr('class', 'node')
	.style('stroke', d => 'red')
	.style('stroke-width', d => width/250)
	.style('fill', d => 'white')

force.on('tick', () => {
	node.attr('r', width/20)
		.attr('cx', d => d.x)
		.attr('cy', d => d.y)

	edge.attr('x1', d => d.source.x)
		.attr('y1', d => d.source.y)
		.attr('x2', d => d.target.x)
		.attr('y2', d => d.target.y)
		.style('stroke', d => 'black')
		.style('stroke-width', d => width/150)
})

force.start()