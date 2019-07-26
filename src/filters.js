import React from "react"
import poketypeJson from "./static/json/pokemon-types.json"
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

class Filters extends React.Component {
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

  toggleCheckbox = (event, json, selectedIds, setSelectedIds) => {
    const selectedId = event.target.value

    if (selectedId === "all") { // "All" Checkbox logic
      if (selectedIds.length === json.length) {
        selectedIds = []
      } else {
        selectedIds = json.map(item => item.id)
      }
    } else { // Normal Checkbox logic
      if (selectedIds.includes(selectedId)) {
        selectedIds = selectedIds.filter(id => id !== selectedId)
      } else {
        selectedIds.push(selectedId)
      }
    }

    setSelectedIds(selectedIds)
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

  renderCheckboxes = (json, selectedIds, setSelectedIds) => {
    // TODO: clean this up
    const allCheckbox = (
      <div>
        <FormControlLabel
          //key={gen.id}
          control={
            <Checkbox
              checked={json.length === selectedIds.length}
              onChange={e =>
                this.toggleCheckbox(e, json, selectedIds, setSelectedIds)
              }
              value={"all"}
            />
          }
          label={"All"}
        />
      </div>
    )
    const normalCheckboxes = json.map(gen => (
      <FormControlLabel
        key={gen.id}
        control={
          <Checkbox
            checked={selectedIds.includes(gen.id)}
            onChange={e =>
              this.toggleCheckbox(e, json, selectedIds, setSelectedIds)
            }
            value={gen.id}
          />
        }
        label={gen.name}
      />
    ))

    return (
      <div>
        {allCheckbox}
        {normalCheckboxes}
      </div>
    )
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

  labelFormatter = (label, selectedIds, jsonLength) => {
    const CUT_OFF = 3
    let ids = selectedIds.sort()
    if (selectedIds.length === jsonLength) {
      ids = "All"
    } else if (selectedIds.length <= CUT_OFF) {
      ids = ids.join(", ")
    } else {
      const remaining = selectedIds.length - CUT_OFF
      ids = `${ids.slice(0, 3).join(", ")} & ${remaining} more`
    }
    return `${label}: ${ids}`
  }

  render() {
    const {
      selectedGenIds,
      setSelectedGenIds,
      selectedTypeIds,
      setSelectedTypeIds,
    } = this.props

    //TODO: clean these up
    //Filter By Generation -- Button and Checkboxes
    const genLabel = this.labelFormatter(
      "Generation",
      selectedGenIds,
      genJson.length
    )
    const genCheckboxes = this.renderCheckboxes(
      genJson,
      selectedGenIds,
      setSelectedGenIds
    )

    //Filter By Type -- Button and Checkboxes
    const typeLabel = this.labelFormatter(
      "Type",
      selectedTypeIds,
      poketypeJson.length
    )
    const typeCheckboxes = this.renderCheckboxes(
      poketypeJson,
      selectedTypeIds,
      setSelectedTypeIds
    )

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            {this.renderFilterButton("generation", genLabel)}
            {this.renderFilterButton("byType", typeLabel)}
          </Toolbar>
        </AppBar>
        {this.renderFilterContent("generation", genCheckboxes)}
        {this.renderFilterContent("byType", typeCheckboxes)}
      </div>
    )
  }
}

export default Filters
