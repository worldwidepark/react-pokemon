import './App.css'
import { useEffect, useState } from 'react'
import { getAllPokemon, getPokemon } from './utils/pokemon'
import Card from './component/Card/Card'
import Navbar from './component/Navbar/Navbar'

function App() {
  const initialURL = 'https://pokeapi.co/api/v2/pokemon'
  const [loading, setLoading] = useState(true)
  const [pokemonData, setPokemonData] = useState([])
  const [nextURL, setNextURL] = useState('')
  const [prevURL, setPrevURL] = useState('')
  useEffect(() => {
    const fetchPokemnonData = async () => {
      //all
      let res = await getAllPokemon(initialURL)
      //each
      loadPokemon(res.results)
      // console.log(res)
      setNextURL(res.next)
      setPrevURL(res.previous)
      setLoading(false)
    }
    fetchPokemnonData()
  }, [])

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        console.log(pokemon)
        let pokemonRecord = getPokemon(pokemon.url)
        return pokemonRecord
      })
    )
    setPokemonData(_pokemonData)
  }
  // console.log(pokemonData)
  const handleNextPage = async () => {
    setLoading(true)
    let data = await getAllPokemon(nextURL)
    await loadPokemon(data.results)
    setLoading(false)
    setPrevURL(data.previous)
    setNextURL(data.next)
  }
  const handleprevPage = async () => {
    if (!prevURL) return

    setLoading(true)
    let data = await getAllPokemon(prevURL)
    await loadPokemon(data.results)
    setLoading(false)
    setPrevURL(data.previous)
    setNextURL(data.next)
  }
  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中。。。</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />
              })}
            </div>
            <div className="btn">
              <button onClick={handleprevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
