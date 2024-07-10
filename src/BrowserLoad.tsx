import React, { useState, useEffect, useRef } from "react"
import * as tf from "@tensorflow/tfjs"
import * as usEncoder from "@tensorflow-models/universal-sentence-encoder"
import { items, Item } from "./items"

const BrowserLoad: React.FC = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Item[]>([])
  const [attemptSearch, setAttemptSearch] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [model, setModel] = useState<any>(null)
  const latestQuery = useRef(query)

  useEffect(() => {
    const initializeTensorFlow = async () => {
      await tf.ready()
      const loadedModel = await usEncoder.load()
      setModel(loadedModel)
    }
    initializeTensorFlow()
  }, [])

  useEffect(() => {
    latestQuery.current = query
  }, [query])

  useEffect(() => {
    if (model && attemptSearch) {
      handleSearch(latestQuery.current)
    }
  }, [model])

  const clickHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value
    setQuery(keyword)

    if (model) {
      handleSearch(keyword)
    } else {
      setAttemptSearch(true)
    }
  }

  const handleSearch = async (keyword: string) => {
    setAttemptSearch(false)
    if (keyword.trim().length <= 3 || !model) {
      setResults([])
    } else {
      const keywordEmbedding = await model.embed([keyword])
      const descriptionsEmbeddings = await model.embed(
        items.map((item) => item.description)
      )

      // Calculate cosine similarity
      const similarities = descriptionsEmbeddings
        .matMul(keywordEmbedding.transpose())
        .arraySync() as number[]

      // Rank items based on similarity
      const rankedItems = items
        .map((item, index) => ({ item, similarity: similarities[index] }))
        .sort((a, b) => b.similarity - a.similarity)

      setResults(
        rankedItems.map((rankedItem) => ({
          ...rankedItem.item,
          similarity: rankedItem.similarity,
        }))
      )
    }
  }

  return (
    <div id=" browser-load" className="container">
      <div>
        <h1>Browser Search</h1>
      </div>
      <div>
        <input
          type="text"
          value={query}
          onChange={clickHandler}
          placeholder="Enter keyword"
        />
      </div>
      <div>
        <h3>Results</h3>
        {attemptSearch ? (
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

export default BrowserLoad
