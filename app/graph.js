const d3 = require('d3');
const data = require('../deltagere.json');

let width = window.innerWidth;
let height = window.innerHeight;

let edges = [];

const numberOfMatches = (data, edges, type) => {
    const val = edges
        .map((edge) => (edge.type === type && (edge.source === data || edge.target === data)))
        .reduce((prev, curr) => prev + curr);

    return val || 0;
};

for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].sex.length; j++) {
        edges.push({
            source: data[i].id,
            target: data[i].sex[j],
            type: 'sex'
        });
    }

    for (let j = 0; j < data[i].notsex.length; j++) {
        edges.push({
            source: data[i].id,
            target: data[i].notsex[j],
            type: 'notsex'
        });
    }

    for (let j = 0; j < data[i].partner.length; j++) {
        edges.push({
            source: data[i].id,
            target: data[i].partner[j],
            type: 'partner'
        });
    }
}

const createNodes = (data, radius, width) => {
    let nodes = [];

    for (let i = 0; i < data.length; i++) {
        const angle = (i / (data.length / 2)) * Math.PI;
        const x = (radius * Math.cos(angle)) + (width / 10);
        const y = (radius * Math.sin(angle)) + (width / 10);

        nodes.push({
            x: x,
            y: y,
            id: data[i].id,
            name: data[i].name,
            picture: data[i].picture,
            age: data[i].age,
            home: data[i].home,
            sex: data[i].sex,
            partner: data[i].partner,
            notsex: data[i].notsex
        });
    }
    return nodes;
};


function runVisualisation() {

    const nodes = createNodes(data, 1000, width);

    let force = d3.layout.force()
        .size([width, height])
        .nodes(nodes)
        .links(edges)
        .linkDistance(Math.min(height, width*0.75) / 1.8)
        .linkStrength(0.05)
        .charge(-1500)

    let svg = d3.select('main').append('svg')
        .attr('width', width)
        .attr('height', height)

    let notSexColor = '#ffadbc'
    let sexColor = '#e74c3c'
    let partnerColor = '#468966'

    let strokeWidth = '5px'

    let edge = svg.selectAll('.link')
        .data(edges)
        .enter()
        .append('line')
        .attr('class', 'link')
        .style('stroke', d => {
            if (d.type === 'sex') {
                return sexColor
            } else if (d.type === 'notsex') {
                return notSexColor
            } else if (d.type === 'partner') {
                return partnerColor
            }
        })
        .style('stroke-width', d => strokeWidth)

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

    let radius = Math.floor(1.85*Math.min(height, width*0.75) / (data.length * 2.3));

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
        .attr('id', (d, i) => 'clip' + i)
        .append('circle')
        .attr('cx', 2 * radius)
        .attr('cy', 2 * radius)
        .attr('r', 2 * radius)

    let image = node.append("svg:image")
        .attr("xlink:href", d => d.picture)
        .attr("width", 2 * radius)
        .attr("height", 2 * radius)
        .attr("x", 0)
        .attr("y", 0)
        .on("click", function() {
            if (d3.event.defaultPrevented) return;
            p = $(this)[0].__data__;

            let partner = "";

            for (let i = 0; i < edges.length; i++) {
                if (p.id === edges[i].source.id && edges[i].type === 'partner') {
                    partner = edges[i].target.name;
                    break;
                }
            }

            if (!partner) {
                for (let i = 0; i < edges.length; i++) {
                    if (p.id === edges[i].target.id && edges[i].type === 'partner') {
                        partner = edges[i].source.name;
                        break;
                    }
                }
            }

            $('#modal').modal();
            $('.modal-title').text(p.name);
            $('.age').text(p.age);
            $('.home').text(p.home);
            $('.pult').text(numberOfMatches(p, edges, 'sex'));
            $('.rotet').text(numberOfMatches(p, edges, 'notsex'));
            $('.partner').text(partner);
        });


    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {
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
        .attr("fill", "none")
        .attr("id", function(d, i) {
            return "s" + i;
        })

    var arcPaths = node.append("g")
        .style("fill", "navy");
    var text = arcPaths.append("text")
        .attr("font-size", 10)
        .style("text-anchor", "middle")
        .append("textPath")
        .attr("xlink:href", function(d, i) {
            return "#s" + i;
        })
        .attr("startOffset", function(d, i) {
            return "50%";
        })
        .text(function(d) {
            return d.name.toUpperCase();
        })


    function tick() {
        circle.attr('r', radius)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .style('fill', 'url(#image)')

        clip.attr('r', radius)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)

        image.attr('r', radius)
            .attr('x', function(d) {
                return d.x - this.getBBox().width / 2
            })
            .attr('y', function(d) {
                return d.y - this.getBBox().height / 2
            })
            .style('fill', 'black')
            .attr('clip-path', (d, i) => 'url(#clip' + i + ')')

        arcs.attr("d", function(d, i) {
            return describeArc(d.x, d.y, radius * 1.2, 160, -160)
        });

        text.style('fill', 'white')
            .style('font-size', String(1.4*radius/50) + 'rem')

        let hasBothSexAndPartner = (d) => {
            let sexAndnotsex = d.source.sex.concat(d.target.sex).concat(d.source.notsex).concat(d.target.notsex)
            let partner = d.source.partner.concat(d.target.partner)
            if (
                (sexAndnotsex.includes(d.source.id) && partner.includes(d.source.id)) ||
                (sexAndnotsex.includes(d.target.id) && partner.includes(d.target.id)) ||
                (sexAndnotsex.includes(d.source.id) && partner.includes(d.target.id)) ||
                (sexAndnotsex.includes(d.target.id) && partner.includes(d.source.id))
            ) {
                return true
            }
            return false
        }

        let fixPositions = (d, reference) => {
            if (hasBothSexAndPartner(d)) {
                if (d.type === 'partner') {
                    return reference-3.3
                } else {
                    return reference+3.3
                }
            }
            return reference
        }

        edge.attr('x1', d => fixPositions(d, d.source.x))
            .attr('y1', d => fixPositions(d, d.source.y))
            .attr('x2', d => fixPositions(d, d.target.x))
            .attr('y2', d => fixPositions(d, d.target.y))
    };

    force.on("tick", tick);
    force.start();

    window.onresize = function() {
        width = window.innerWidth;
        height = window.innerHeight;
        radius = Math.floor(1.85*Math.min(height, width*0.75) / (data.length * 2.3));

        svg.attr('width', width)
            .attr('height', height)
        image.attr("width", 2 * radius)
            .attr("height", 2 * radius)
        force.size([width, height])
            .linkDistance(Math.min(height, width*0.75) / 1.8)
            .resume()
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    runVisualisation()
    document.querySelector('aside').hidden = false
    document.querySelector('#modal').hidden = false
})