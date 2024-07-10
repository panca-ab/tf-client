import React, { useState, useEffect } from "react"
// import * as tf from "@tensorflow/tfjs"
// import * as usEncoder from "@tensorflow-models/universal-sentence-encoder"
import { Item, items } from "./items"
import Fuse from "fuse.js"

const fuse = new Fuse(items, {
  keys: ["description"],
  includeScore: true,
  threshold: 0.5, // Adjust the threshold based on your requirements
})

const FuzzySearch: React.FC = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Item[]>([])

  useEffect(() => {
    if (query && query.trim().length > 3) {
      if (query.trim()) {
        const fuseResults = fuse.search(query)
        const sortedResults = fuseResults
          .map((result) => ({
            ...result.item,
            similarity: result.score,
          }))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .sort((a: any, b: any) => {
            if (a && b) {
              return a.similarity - b.similarity
            }
            return 0
          })

        setResults(sortedResults)
      } else {
        setResults([])
      }
    } else {
      setResults([])
    }
  }, [query])

  const inputHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <div id="fuzzy-search" className="container">
      <div>
        <h1>Fuzzy search</h1>
      </div>
      <div>
        <input
          type="text"
          value={query}
          onChange={inputHandler}
          placeholder="Enter keyword"
        />
      </div>
      <div>
        <h3>Results</h3>
        <ol className="result-list">
          {results.map((item) => (
            <li key={item.id} className={item.className}>
              <p>{item.description}</p>
              {item.similarity && <p>Similarity: {item.similarity}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default FuzzySearch
