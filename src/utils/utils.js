import poketypejson from "../static/json/pokemon-types.json"

function getPokeMatrix (pokeRange) {
  let pokeMatrix = []
  let pokeMatrix2 = []

  //TODO: look up faster way to initialize matrix
  for (const i in poketypejson) {
    pokeMatrix[i] = []
    pokeMatrix2[i] = []
    for (const j in poketypejson) {
      pokeMatrix[i][j] = 0
      pokeMatrix2[i][j] = []
    }
  }


  // create input data: a square matrix that show links between types
  for (let poke of pokeRange) {
    if (poke.type.length === 1) {
      const index0 = poketypejson.findIndex(
        type => type.name === poke.type[0]
      )
      pokeMatrix[index0][index0]++
      pokeMatrix2[index0][index0].push(poke)
    } else {
      const index1 = poketypejson.findIndex(
        type => type.name === poke.type[0]
      )
      const index2 = poketypejson.findIndex(
        type => type.name === poke.type[1]
      )
      pokeMatrix[index1][index2]++
      pokeMatrix[index2][index1]++
      pokeMatrix2[index1][index2].push(poke)
      pokeMatrix2[index2][index1].push(poke)
    }
  }

  return { pokeMatrix, pokeMatrix2 }
}

export { getPokeMatrix }