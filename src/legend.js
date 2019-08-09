import React from "react"
import styled from "styled-components"
import poketypejson from "./static/json/pokemon-types.json"

const PokeTileWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const PokeTile = styled.div`
  padding: 4px 8px 4px 4px;
  width: 140px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

class LegenDary extends React.Component {
  render() {
    const { type1Index, type2Index, value, pokemon } = this.props

    return (
      <div>
        <h3>Pokemon Types</h3>
        <div>
          <b>Type 1:</b> {poketypejson[type1Index].name}&nbsp;&nbsp;&nbsp;
          <b>Type 2:</b> {poketypejson[type2Index].name}
        </div>
        <br />
        <div>
          <b>Number of Pokes:</b> {value}
        </div>
        <br />
        <PokeTileWrapper>
          {pokemon.map(pk => {
            return (
              <PokeTile>
                <img alt="pokesprite" src={require(`./static/sprites/${pk.id}.png`)} />
                {pk.name.english}
              </PokeTile>
            )
          })}
        </PokeTileWrapper>
      </div>
    )
  }
}

export default LegenDary
