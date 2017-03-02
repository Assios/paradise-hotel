let width = 800;
let height = 500;
let nodes = [
	{x: 0.1*width, y: 0.1*height, name: 'Julius'},
	{x: 0.2*width, y: 0.2*height, name: 'Fulvia'},
	{x: 0.1*width, y: 0.8*height, name: 'Octavia'}
]
let edges = [
	{source: 0, target: 1, type: 'sex'},
	{source: 0, target: 2, type: 'notsex'}
]

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

let node = svg.selectAll('.node')
	.data(nodes)
	.enter()
	.append('g')

let circle = node.append('circle')
	.attr('class', 'node')
	.style('stroke', d => '#ccc')
	.style('stroke-width', d => '10px')
	.style('fill', d => 'white')

let text = node.append('text')
	.attr('class', 'node-label')
	.text(d => d.name)

force.on('tick', () => {
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
})

force.start()