import React from "react"
import "./App.css"
import ChordChart from "./chord-chart.js"
import pokejson from "./pokemon.json"
import poketypejson from "./pokemon-types.json"

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

console.log("pokematrix", pokematrix)

class App extends React.Component {
  constructor(props) {
    super(props)

    // create input data: a square matrix that provides flow between entities
    //for(const poke of pokejson) {
    for (let i = 0; i < 800; i++) {
      let poke = pokejson[i]
      if (poke.type.length === 1) {
        const index0 = poketypejson.findIndex(to => to.name === poke.type[0])
        pokematrix[index0][index0] = pokematrix[index0][index0] + 1
        pokematrix2[index0][index0].push(poke)
      } else {
        const index1 = poketypejson.findIndex(to => to.name === poke.type[0])
        const index2 = poketypejson.findIndex(to => to.name === poke.type[1])
        pokematrix[index1][index2] = pokematrix[index1][index2] + 1
        pokematrix[index2][index1] = pokematrix[index2][index1] + 1
        pokematrix2[index1][index2].push(poke)
        pokematrix2[index2][index1].push(poke)
      }
    }
    this.state = {
      pokematrix,
      pokematrix2,
    }
  }

  render() {
    return (
      <div>
        <ChordChart
          pokematrix={this.state.pokematrix}
          pokematrix2={this.state.pokematrix2}
        />
        <div id="type_container">Bob</div>
      </div>
    )
  }
}

export default App
