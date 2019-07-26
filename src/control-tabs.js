import React from "react"
import genJson from "./static/json/pokemon-gens.json"
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
import styled from "styled-components"

const FilterContent = styled(Typography)`
  padding: 4px 16px;
  background: #3f51b533;
`

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

  renderFilterButton = (id, label) => {
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

  renderGenCheckboxes = () => {
    const { selectedGenIds } = this.props
    return genJson.map(gen => (
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
    ))
  }

  renderFilterContent = (index, content) => {
    const { activeButtonId } = this.state
    return (
      <FilterContent
        component="div"
        role="tabpanel"
        hidden={activeButtonId !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {content}
      </FilterContent>
    )
  }

  render() {
    const { selectedGenIds } = this.props

    //TODO: calculate from multiple names w/out repeating "Gen"
    const genLabel = selectedGenIds.sort().join(", ")
    const genCheckboxes = this.renderGenCheckboxes()

    return (
      <div>
        <AppBar position="static">
          <Toolbar>{this.renderFilterButton("generation", genLabel)}</Toolbar>
        </AppBar>
        {this.renderFilterContent("generation", genCheckboxes)}
        {this.renderFilterContent("typeStuff", "Coming Soon")}
      </div>
    )
  }
}

export default App
