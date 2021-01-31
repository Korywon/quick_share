import './App.css';
import Controller from './components/controller.component';
import GitHub from './components/github.component';
import { FaRocket } from 'react-icons/fa';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h4><FaRocket /> Quick Share</h4>
        <Controller />
        <GitHub />
      </header>
    </div>
  );
}

export default App;
