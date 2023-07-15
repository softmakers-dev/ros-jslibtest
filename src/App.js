import logo from './logo.svg'
import './App.css'
import SendMessage from "./components/functions"

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <SendMessage/>
      </div>
  )
}

export default App;
