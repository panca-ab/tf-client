import React from "react"
import BrowserLoad from "./BrowserLoad"
import ApiCall from "./ApiCall"
import FuzzySearch from "./FuzzySearch"
import "./App.css"

const App: React.FC = () => {
  return (
    <div id="layout">
      <div>
        <BrowserLoad />
      </div>
      <div>
        <ApiCall />
      </div>
      <div>
        <FuzzySearch />
      </div>
    </div>
  )
}

export default App
