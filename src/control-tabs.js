import React from "react"
import genJson from "./pokemon-gens.json"
import {
  AppBar,
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core"


class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tabValue: null,
    }
  }

  changeTab = (_e, newValue) => {
    if (this.state.tabValue === newValue) {
      this.setState({ tabValue: null })
    } else {
      this.setState({ tabValue: newValue })
    }
  }

  toggleGen = e => {
    let { selectedGenIds, setSelectedGenIds } = this.props
    const selectedGenId = e.target.value

    if (selectedGenIds.includes(selectedGenId)) {
      selectedGenIds = selectedGenIds.filter(id => id !== selectedGenId)
    } else {
      selectedGenIds.push(selectedGenId)
    }

    setSelectedGenIds(selectedGenIds)
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


  render() {
    const { selectedGenIds } = this.props
    const { tabValue } = this.state

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
}

export default App
