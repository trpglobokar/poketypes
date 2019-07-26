import React from "react"
import genJson from "./pokemon-gens.json"
import {
  AppBar,
  Button,
  Checkbox,
  FormControlLabel,
  Toolbar,
  Typography,
} from "@material-ui/core"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeButtonId: "",
    }
  }

  toggleButton = activeButtonId => {
    if (this.state.activeButtonId === activeButtonId) {
      this.setState({ activeButtonId: "" })
    } else {
      this.setState({ activeButtonId })
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

  renderButtons = (id, label) => {
    const ArrowIcon =
      this.state.activeButtonId === id ? ArrowDropUpIcon : ArrowDropDownIcon

    return (
      <Button
        color="inherit"
        value={id}
        onClick={() => {
          this.toggleButton(id)
        }}
      >
        {label}
        <ArrowIcon />
      </Button>
    )
  }

  renderTabContent = (index, content) => {
    const { activeButtonId } = this.state
    console.log("activeButtonId", activeButtonId)

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={activeButtonId !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {content}
      </Typography>
    )
  }

  render() {
    const { selectedGenIds } = this.props

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
          <Toolbar>
            {this.renderButtons("genStuff", genLabel)}
          </Toolbar>
        </AppBar>
        {this.renderTabContent("genStuff", genCheckboxes)}
        {this.renderTabContent("typeStuff", "Coming Soon")}
      </div>
    )
  }
}

export default App
