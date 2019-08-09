import React from "react"
import { renderToString } from "react-dom/server"
import * as d3 from "d3"
import poketypejson from "./static/json/pokemon-types.json"
import LegenDary from "./legend.js"

const WRAPPER_RADIUS = 390 //390
const margin = { top: 80, right: 0, bottom: 100, left: 100 },
  width = WRAPPER_RADIUS * 2 - margin.left - margin.right,
  height = WRAPPER_RADIUS * 2 - margin.top - margin.bottom,
  cellSize = Math.floor(width / 24),
  buckets = 9,
  colors = [
    "hsl(190, 100%, 90%)",
    "hsl(190, 100%, 80%)",
    "hsl(190, 100%, 70%)",
    "hsl(190, 100%, 60%)",
    "hsl(190, 100%, 50%)",
    "hsl(190, 100%, 40%)",
    "hsl(190, 100%, 30%)",
    "hsl(190, 100%, 20%)",
    "hsl(190, 100%, 10%)",
  ], // alternatively colorbrewer.YlGnBu[9]
  types = poketypejson.map(type => type.name)

console.log("cellSize", cellSize)

class ChordChart extends React.Component {
  async componentDidMount() {
    await this.drawChart()
  }

  shouldComponentUpdate(nextProps, nextState) {
    //TODO: check if props != nextProps
    return true
  }

  async componentDidUpdate() {
    await this.drawChart()
  }

  renderLabels(svg, className, textAnchor) {
    return svg
      .selectAll(`.${className}`)
      .data(types)
      .enter()
      .append("text")
      .text(d => d)
      //.style("fill", d => poketypejson.find(type => type.name === d).color)
      .style("text-anchor", textAnchor)
  }

  renderLegend(d) {
    const type1Index = d.type1 - 1,
      type2Index = d.type2 - 1
    const pokemon = this.props.pokematrix2[type1Index][type2Index]
    const legendContent = (
      <LegenDary
        type1Index={type1Index}
        type2Index={type2Index}
        value={d.value}
        pokemon={pokemon}
      />
    )
    d3.select("#chord-legend-content").html(renderToString(legendContent))
  }

  async drawChart() {
    d3.select("#heatmap")
      .selectAll("*")
      .remove()

    var data = []
    for (let type1 in this.props.pokematrix) {
      for (let type2 in this.props.pokematrix[type1]) {
        data.push({
          type1: parseInt(type1) + 1,
          type2: parseInt(type2) + 1,
          value: this.props.pokematrix[type1][type2],
        })
      }
    }

    var svg = d3
      .select("#heatmap")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    this.renderLabels(svg, "type1Labels", "end")
      .attr("x", 0)
      .attr("y", (_d, i) => i * cellSize)
      .attr("transform", "translate(-6," + cellSize / 1.5 + ")")

    this.renderLabels(svg, "type2Labels", "start")
      .attr("x", (_d, i) => i * cellSize)
      .attr("y", 0)
      .attr(
        "transform",
        (_d, i) => `translate(${i * 8.5 + 12},${i * 19.8 - 4}) rotate(-45)`
      )

    var colorScale = d3
      .scaleQuantile()
      .domain([0, buckets - 1, d3.max(data, d => d.value)])
      .range(colors)

    svg
      .selectAll(".type-squares")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => (d.type2 - 1) * cellSize)
      .attr("y", d => (d.type1 - 1) * cellSize)
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .style("fill", d => (d.value === 0 ? "#ffffff" : colorScale(d.value)))
      .style("strokeWidth", "4px")
      .style("stroke", "#fff")
      .on("mouseover", d => {
        d3.select(d3.event.currentTarget).style("stroke", "hsl(190, 100%, 10%)")
        this.renderLegend(d)
      })
      .on("mouseleave", d => {
        d3.select(d3.event.currentTarget).style("stroke", "#fff")
      })
  }

  render() {
    return (
      <div
        id="heatmap-container"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div id="heatmap" style={{ height: "800px", width: "800px" }} />
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
