import React from "react"
import "./App.css"
import ChordChart from "./chord-chart.js"
import pokejson from "./pokemon.json"
import poketypejson from "./pokemon-types.json"
import {
  AppBar,
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core"

const genJson = [
  {
    id: "gen1",
    name: "Gen 1",
    range: {
      start: 1,
      end: 151,
    }
  },
  {
    id: "gen2",
    name: "Gen 2",
    range: {
      start: 152,
      end: 251,
    }
  },
  {
    id: "gen3",
    name: "Gen 3",
    range: {
      start: 252,
      end: 386,
    }
  },
  {
    id: "gen4",
    name: "Gen 4",
    range: {
      start: 387,
      end: 493,
    }
  },
  {
    id: "gen5",
    name: "Gen 5",
    range: {
      start: 494,
      end: 649,
    }
  },
  {
    id: "gen6",
    name: "Gen 6",
    range: {
      start: 650,
      end: 721,
    }
  },
  {
    id: "gen7",
    name: "Gen 7",
    range: {
      start: 722,
      end: 807,
    }
  },
]

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedGenIds: ["gen1"],
      genMenuOpen: false,
      tabValue: null,
    }
  }

  handleMenuOpen = _e => {
    this.setState({ genMenuOpen: true })
  }

  handleMenuClose = _e => {
    this.setState({ genMenuOpen: false })
  }

  changeTab = (_e, newValue) => {
    if (this.state.tabValue === newValue) {
      this.setState({ tabValue: null })
    } else {
      this.setState({ tabValue: newValue })
    }
  }

  toggleGen = e => {
    const selectedGenId = e.target.value
    let { selectedGenIds } = this.state

    if (selectedGenIds.includes(selectedGenId)) {
      selectedGenIds = selectedGenIds.filter(id => id !== selectedGenId)
    } else {
      selectedGenIds.push(selectedGenId)
    }

    this.setState({
      selectedGenIds,
    })
  }

  renderControlTabs = _e => {
    const { tabValue, selectedGenIds } = this.state

    const genCheckboxes = genJson.map(gen => {
      return (
        <FormControlLabel
          key={gen.id}
          control={
            <Checkbox
              checked={selectedGenIds.includes(gen.id)}
              onChange={this.toggleGen}
              value={gen.id.toString()}
            />
          }
          label={gen.name}
        />
      )
    })

    //TODO: calculate from multiple names w/out repeating "Gen"
    const genLabel = selectedGenIds.sort().join(", ")

    return (
      <div>
        <AppBar position="static">
          {/*<Typography>Showing:</Typography>*/}
          <Tabs
            value={tabValue}
            onChange={this.changeTab}
            aria-label="simple tabs example"
          >
            <Tab label={genLabel} id="gen-tab-1" />
            <Tab label="Chord Chart" id="other-tab-1" />
          </Tabs>
        </AppBar>
        {this.renderTabContent(0, genCheckboxes)}
        {this.renderTabContent(1, "Coming Soon")}
      </div>
    )
  }

  renderTabContent = (index, content) => {
    const { tabValue } = this.state
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={tabValue !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {content}
      </Typography>
    )
  }

  getPokeRange = _e => {
    const { selectedGenIds } = this.state
    const selectedGens = genJson.filter(gen => selectedGenIds.includes(gen.id))

    let newThing = []
    selectedGens.forEach(gen => {
      newThing = newThing.concat(pokejson.slice(gen.range.start, gen.range.end))
    })
    return newThing
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
        const index0 = poketypejson.findIndex(type => type.name === poke.type[0])
        pokematrix[index0][index0] = pokematrix[index0][index0] + 1
        pokematrix2[index0][index0].push(poke)
      } else {
        const index1 = poketypejson.findIndex(type => type.name === poke.type[0])
        const index2 = poketypejson.findIndex(type => type.name === poke.type[1])
        pokematrix[index1][index2] = pokematrix[index1][index2] + 1
        pokematrix[index2][index1] = pokematrix[index2][index1] + 1
        pokematrix2[index1][index2].push(poke)
        pokematrix2[index2][index1].push(poke)
      }
    }

    return (
      <div>
        {this.renderControlTabs()}
        <ChordChart pokematrix={pokematrix} pokematrix2={pokematrix2} />
      </div>
    )
  }
}

export default App
