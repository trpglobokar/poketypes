import React from "react"
import "./App.css"
import ChordChart from "./chord-chart.js"
import ControlTabs from "./control-tabs.js"
import pokejson from "./pokemon.json"
import poketypejson from "./pokemon-types.json"
import genJson from "./pokemon-gens.json"

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedGenIds: ["gen1"],
    }
  }

  getPokeRange = _e => {
    const { selectedGenIds } = this.state
    const selectedGens = genJson.filter(gen => selectedGenIds.includes(gen.id))

    let pokeRange = []
    selectedGens.forEach(gen => {
      pokeRange = pokeRange.concat(pokejson.slice(gen.range.start, gen.range.end))
    })
    return pokeRange
  }

  render() {
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

    const pokeRange = this.getPokeRange()
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
      <div>
        <ControlTabs
          selectedGenIds={this.state.selectedGenIds}
          setSelectedGenIds={e => {
            this.setState({ selectedGenIds: e })
          }}
        />
        <ChordChart pokematrix={pokematrix} pokematrix2={pokematrix2} />
      </div>
    )
  }
}

export default App
