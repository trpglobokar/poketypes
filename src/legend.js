import React from "react"

class LegenDary extends React.Component {
  render() {
    const names = this.props.pokenames.map(pn => {
      return (
        <div
          style={{
            padding: "8px",
            width: 100,
            border: "1px solid #ccc",
            borderRadius: 4,
            margin: 4,
          }}
        >
          {pn}
        </div>
      )
    })

    return <div style={{ display: "flex", flexWrap: "wrap" }}>{names}</div>
  }
}

export default LegenDary
