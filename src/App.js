import React from "react"
import "./static/css/App.css"
import HeatMap from "./charts/heatmap.js"
import ChordChart from "./charts/chord-chart.js"
import Filters from "./filters.js"
import pokejson from "./static/json/pokemon.json"
import poketypejson from "./static/json/pokemon-types.json"
import genJson from "./static/json/pokemon-gens.json"

import { getPokeMatrix } from "./utils/utils.js"

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#23B5D3", contrastText: "#FBFBFB" },
    secondary: { main: "#071013", contrastText: "#FBFBFB" },
  },
  typography: {
    fontFamily: [
      "typeface-roboto",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    useNextVariants: true,
  },
})

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedGenIds: genJson.map(gen => gen.id),
      selectedTypeIds: poketypejson.map(type => type.id),
      selectedChartType: "chord",
    }
  }

  getPokeRange = _e => {
    const { selectedGenIds, selectedTypeIds } = this.state
    const selectedGens = genJson.filter(gen => selectedGenIds.includes(gen.id))

    let pokeRange = []
    selectedGens.forEach(gen => {
      pokeRange = pokeRange.concat(
        pokejson.slice(gen.range.start, gen.range.end)
      )
    })

    return pokeRange.filter(poke =>
      poke.type.some(t => selectedTypeIds.includes(t))
    )
  }

  render = () => {
    const { selectedGenIds, selectedTypeIds, selectedChartType } = this.state

    const pokeRange = this.getPokeRange()
    const { pokeMatrix, pokeMatrix2 } = getPokeMatrix(pokeRange)


    return (
      <MuiThemeProvider theme={theme}>
        <Filters
          selectedGenIds={selectedGenIds}
          setSelectedGenIds={e => {
            this.setState({ selectedGenIds: e })
          }}
          selectedTypeIds={selectedTypeIds}
          setSelectedTypeIds={e => {
            this.setState({ selectedTypeIds: e })
          }}
          selectedChartType={selectedChartType}
          setSelectedChartType={e => {
            this.setState({ selectedChartType: e })
          }}
        />
        {selectedChartType === "heatmap" && (
          <HeatMap
            pokematrix={pokeMatrix}
            pokematrix2={pokeMatrix2}
          />
        )}
        {selectedChartType === "chord" && (
          <ChordChart
            pokematrix={pokeMatrix}
            pokematrix2={pokeMatrix2}
            pokelength={pokeRange.length}
          />
        )}
      </MuiThemeProvider>
    )
  }
}

export default App
