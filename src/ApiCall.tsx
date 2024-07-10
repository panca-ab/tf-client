import React, { useState, useEffect } from "react"
import { Item } from "./items"
import { debounce } from "lodash"

const ApiCall: React.FC = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Item[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (query && query.trim().length > 3) {
      debouncedFetchData(query)
    } else {
      setResults([])
    }
  }, [query])

  const fetchData = async (searchQuery: string) => {
    setIsSearching(true)
    try {
      const response = await fetch("https://tf-server.vercel.app/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: searchQuery }),
      })
      const data = await response.json()
      setResults(data.results)

      setIsSearching(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setIsSearching(false)
    }
  }

  const debouncedFetchData = debounce((searchQuery: string) => {
    fetchData(searchQuery)
  }, 500)

  const changeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <div id="api-call" className="container">
      <div>
        <h1>API Call</h1>
      </div>
      <div>
        <input
          type="text"
          value={query}
          onChange={changeHandler}
          placeholder="Enter keyword"
        />
      </div>
      <div>
        <h3>Results</h3>
        {isSearching && query.trim().length > 3 ? (
          <h4>Loading...</h4>
        ) : (
          <ol className="result-list">
            {results.map((item) => (
              <li key={item.id} className={item.className}>
                <p>{item.description}</p>
                {item.similarity && <p>Similarity: {item.similarity}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

export default ApiCall
