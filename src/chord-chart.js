import React from "react"
import { renderToString } from "react-dom/server"
import * as d3 from "d3"
import poketypejson from "./static/json/pokemon-types.json"
import LegenDary from "./legend.js"

const WRAPPER_RADIUS = 350 //390
const CHORD_RADIUS = WRAPPER_RADIUS - 85

class ChordChart extends React.Component {
  componentDidMount() {
    this.drawChart()
  }

  shouldComponentUpdate(nextProps, nextState) {
    //TODO: check if props != nextProps
    return true
  }

  componentDidUpdate() {
    this.drawChart()
  }

  addLabel(
    group,
    className,
    tickInterval,
    endMarker,
    fontSize,
    outerPosition,
    getContent,
    appendContent
  ) {
    const gMan = group
      .selectAll(className)
      .data(d => getContent(d, tickInterval, endMarker))
      .enter()
      .append("g")
      .attr("transform", function(d) {
        return (
          "rotate(" +
          ((d.angle * 180) / Math.PI - 90) +
          ") translate(" +
          outerPosition +
          ",0)"
        )
      })
    appendContent(gMan, fontSize)
  }

  appendLine(gMan) {
    gMan
      .append("line") // By default, x1 = y1 = y2 = 0, so no need to specify them
      .attr("x2", 6)
      .attr("stroke", "black")
  }

  appendText(gMan, fontSize) {
    gMan
      .append("text")
      .attr("x", 8)
      .attr("dy", ".35em")
      .attr("transform", d =>
        d.angle > Math.PI ? "rotate(180) translate(-16)" : null
      )
      .style("text-anchor", d => (d.angle > Math.PI ? "end" : null))
      .text(d => d.value)
      .style("font-size", fontSize)
  }

  // Returns array of tick angles & values for a given group and step
  getTicks(d, step, endMarker) {
    const k = (d.endAngle - d.startAngle) / 100
    return d3.range(0, endMarker, step).map(function(value) {
      return { value: `${value}%`, angle: value * k + d.startAngle }
    })
  }

  // Return single array of label angle & value per group
  getTypeLabels(d) {
    const k = (d.endAngle - d.startAngle) / 2
    return [{ value: poketypejson[d.index].name, angle: k + d.startAngle }]
  }

  renderLegend(d) {
    const pokemon = this.props.pokematrix2[d.source.index][d.target.index]
    const legendContent = (
      <LegenDary source={d.source} target={d.target} pokemon={pokemon} />
    )
    d3.select("#chord-legend-content").html(renderToString(legendContent))
  }

  drawChart() {
    const { pokematrix } = this.props
    d3.select("#chord-chart").selectAll("*").remove()

    // Creates the svg area
    const svg = d3
      .select("#chord-chart")
      .append("svg")
      .attr("width", WRAPPER_RADIUS * 2)
      .attr("height", WRAPPER_RADIUS * 2)
      .append("g")
      .attr("transform", `translate(${WRAPPER_RADIUS},${WRAPPER_RADIUS})`)

    // Passes matrix to d3.chord(); calculates info needed to draw arc and ribbon
    const res = d3
      .chord()
      .padAngle(0.05) // padding between entities (black arc)
      .sortSubgroups(d3.descending)(pokematrix)

    // Add the links between groups
    svg
      .datum(res)
      .append("g")
      .selectAll("path")
      .data(d => d)
      .enter()
      .append("path")
      .attr("d", d3.ribbon().radius(CHORD_RADIUS))
      .style("fill", d => `${poketypejson[d.source.index].color}55`)
      .on("mouseover", d => {
        d3.select(d3.event.currentTarget).style(
          "fill",
          poketypejson[d.source.index].color
        )
        this.renderLegend(d)
      })
      .on("mouseleave", d => {
        d3.select(d3.event.currentTarget).style(
          "fill",
          `${poketypejson[d.source.index].color}55`
        )
      })

    // Declare group object that represents each type group
    const group = svg
      .datum(res)
      .append("g")
      .selectAll("g")
      .data(d => d.groups)
      .enter()

    // Add type group arcs on circle rim
    group
      .append("g")
      .append("path")
      .style("fill", (_d, i) => poketypejson[i].color)
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(CHORD_RADIUS - 20)
          .outerRadius(CHORD_RADIUS)
      )

    // Add the ticks
    this.addLabel(
      group,
      ".group-tick",
      12.5,
      101,
      9,
      CHORD_RADIUS,
      this.getTicks,
      this.appendLine
    )

    // Add a couple tick labels:
    this.addLabel(
      group,
      ".group-tick-label",
      25,
      100,
      9,
      CHORD_RADIUS,
      this.getTicks,
      this.appendText
    )
    // Adds type labels to groups
    this.addLabel(
      group,
      ".group-type-label",
      1,
      2,
      12,
      CHORD_RADIUS + 30,
      this.getTypeLabels,
      this.appendText
    )
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div id="chord-chart" />
        <div
          id="chord-legend-wrapper"
          style={{
            width: `calc(100% - ${WRAPPER_RADIUS * 2}px)`,
            minHeight: "100vh",
            borderLeft: "1px solid #ccc",
          }}
        >
          <div id="chord-legend-content" style={{ padding: 16 }}>
            Hover to start
          </div>
        </div>
      </div>
    )
  }
}

export default ChordChart
