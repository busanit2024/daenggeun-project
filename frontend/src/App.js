import logo from './logo.svg';
import './App.css';
import axios from "axios";

function App() {
  axios.get("/test")
  .then((response) => console.log(response.data))
  .catch((error) => console.log(error));
  return (
    <div>

    </div>
  );
}

export default App;
