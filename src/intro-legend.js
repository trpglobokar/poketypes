import React from "react"
import styled from "styled-components"

const SnazzyP = styled.p`
  text-align: justify;
  line-height: 1.4em;
`

class IntroLegend extends React.Component {
  render() {
    return (
      <div>
        <h2>Welcome to the PokéTypes Picker</h2>
        <SnazzyP>
          This picker visualizes the numeric differences between the various
          Pokemon types.
        </SnazzyP>
        <SnazzyP>
          Ever wondered just how many dang Normal-only types there are? What
          type combos don't have existing Pokemon yet? Which generations had the
          most balanced vs unbalanced selection of new Pokemon? This picker is
          for you.
        </SnazzyP>
        <h3>Filter by Generation and Type</h3>
        <SnazzyP>
          Use the top menu to filter down to Pokemon from specific generations
          and/or specific types.
        </SnazzyP>
        <h3>Hover to Explore</h3>
        <SnazzyP>
          When you're ready, hover over the chart to view the list of relevant
          Pokemon.
        </SnazzyP>
        <SnazzyP>Have fun!</SnazzyP>
      </div>
    )
  }
}

export default IntroLegend
