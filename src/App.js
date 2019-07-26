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
    pokemon: [1, 151],
  },
  {
    id: "gen2",
    name: "Gen 2",
    pokemon: [152, 251],
  },
  {
    id: "gen3",
    name: "Gen 3",
    pokemon: [252, 387],
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

  renderControlTabs = _e => {
    const { tabValue, selectedGenIds } = this.state

    const jones = genJson.map(gen => {
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

    //TODO: calculate from multiple names
    const genLabel = selectedGenIds[0]

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
        {this.renderTabContent(0, jones)}
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

  toggleGen = e => {
    const newGen = e.target.value

    this.setState({
      selectedGenIds: [newGen],
    })
  }

  render() {
    const { selectedGenIds } = this.state

    const selectedGen = genJson.find(gen => gen.id === selectedGenIds[0])

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

    // create input data: a square matrix that provides flow between entities
    //for(const poke of pokejson) {
    for (let i = selectedGen.pokemon[0]; i < selectedGen.pokemon[1]; i++) {
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

    return (
      <div>
        {this.renderControlTabs()}
        <ChordChart pokematrix={pokematrix} pokematrix2={pokematrix2} />
      </div>
    )
  }
}

export default App
