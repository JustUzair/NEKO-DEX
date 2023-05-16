import React from 'react'
import { Game } from './game.js'
import { useState } from 'react'

export default function Home() {

  const [login, setLogin] = useState(true);

  const Login = () => {
    return (
        <div className="container">
          <div className="login">
        <h1> NEKO DEX Cafe </h1>
        Please connect your wallet to continue
        <br/>
        <button className="login-button" onClick={() => setLogin(false)}> Login </button>
        </div>
        </div>
        
    );
    }
  if(login) return (<Login/>
  )
  else
  return (<Game/>)

}