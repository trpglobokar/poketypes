import React from "react"
import "./static/css/App.css"
import ChordChart from "./chord-chart.js"
import Filters from "./filters.js"
import pokejson from "./static/json/pokemon.json"
import poketypejson from "./static/json/pokemon-types.json"
import genJson from "./static/json/pokemon-gens.json"
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
    }
  }

  getPokeRange = _e => {
    const { selectedGenIds } = this.state
    const selectedGens = genJson.filter(gen => selectedGenIds.includes(gen.id))

    let pokeRange = []
    selectedGens.forEach(gen => {
      pokeRange = pokeRange.concat(
        pokejson.slice(gen.range.start, gen.range.end)
      )
    })
    return pokeRange
  }

  filterByType = pokeRange => {
    const { selectedTypeIds } = this.state

    return pokeRange.filter(poke =>
      poke.type.some(t => selectedTypeIds.includes(t))
    )
  }

  render() {
    const { selectedGenIds, selectedTypeIds } = this.state

    //declare blank matrix
    let pokematrix = []
    let pokematrix2 = []
    for (const i in poketypejson) {
      pokematrix[i] = []
      pokematrix2[i] = []
      for (const j in poketypejson) {
        pokematrix[i][j] = 0
        pokematrix2[i][j] = []
      }
    }

    let pokeRange = this.getPokeRange()
    pokeRange = this.filterByType(pokeRange)

    // create input data: a square matrix that show links between types
    for (let poke of pokeRange) {
      if (poke.type.length === 1) {
        const index0 = poketypejson.findIndex(
          type => type.name === poke.type[0]
        )
        pokematrix[index0][index0] = pokematrix[index0][index0] + 1
        pokematrix2[index0][index0].push(poke)
      } else {
        const index1 = poketypejson.findIndex(
          type => type.name === poke.type[0]
        )
        const index2 = poketypejson.findIndex(
          type => type.name === poke.type[1]
        )
        pokematrix[index1][index2] = pokematrix[index1][index2] + 1
        pokematrix[index2][index1] = pokematrix[index2][index1] + 1
        pokematrix2[index1][index2].push(poke)
        pokematrix2[index2][index1].push(poke)
      }
    }

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
        />
        <ChordChart pokematrix={pokematrix} pokematrix2={pokematrix2} />
      </MuiThemeProvider>
    )
  }
}

export default App
