let width = 800;
let height = 500;
let nodes = [
	{x: 0.1*width, y: 0.1*height, name: 'Julius'},
	{x: 0.2*width, y: 0.2*height, name: 'Fulvia'},
	{x: 0.1*width, y: 0.8*height, name: 'Octavia'}
]
let edges = [
	{source: 0, target: 1},
	{source: 0, target: 2}
]

let force = d3.layout.force()
	.size([width, height])
	.nodes(nodes)
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
	.style('stroke', d => 'black')
	.style('stroke-width', d => "2px")

let node = svg.selectAll('.node')
	.data(nodes)
	.enter()
	.append('g')

let circle = node.append('circle')
	.attr('class', 'node')
	.style('stroke', d => 'red')
	.style('stroke-width', d => '1.5px')
	.style('fill', d => 'white')

let text = node.append('text')
	.attr('class', 'node-label')
	.text(d => d.name)

force.on('tick', () => {
	let radius = width/20
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
})

force.start()