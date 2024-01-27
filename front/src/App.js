import logo from './logo.svg';
import './App.scss';
import Login from './login/Login';
import Deshborde from './deshborde/Deshborde';
import { useState } from 'react';

function App() {
  const [user,setUser] = useState(null);

  return (
    <div className="App">
      {user ? <Deshborde user={user} setUser={setUser}/> : <Login setUser={setUser}/> }
    </div>
  );
}

export default App;
