import React from 'react'
import { Game } from './game.js'
import { useState } from 'react'

export default function Home() {

  const [login, setLogin] = useState(0);

  async function startLogin(){
    setLogin(1);
    await timeout(1000);
    setLogin(2);
  }

  function timeout(x) {
    return new Promise( res => setTimeout(res, x) );
}

  const LoginFade = () => {
    return (
      <div className="container">
        
        <div className="login-fadeout" >
        
        <div style={{textShadow:"3px 3px black", fontSize:"50px"
      ,paddingTop:"180px"
      }}> NEKO DEX Cafe 
        </div>
        <div style={{textShadow:"3px 3px black", fontSize: "30px"}}> 猫分散型交流カフェ </div>
   
   <div style={{textShadow:"3px 3px black",paddingTop:"100px"}}> Please connect your wallet to continue</div>  
      <br/>
      <button className="login-button" onClick={() => startLogin()}> Login </button>
      </div>
      </div>
      
  );
    }

  
  const Login = () => {
    return (
        <div className="container">
          
          <div className="login" >
          
        <div style={{textShadow:"3px 3px black", fontSize:"50px"
      ,paddingTop:"180px"
      }}> NEKO DEX Cafe 
        </div>
        <div style={{textShadow:"3px 3px black", fontSize: "30px"}}> 猫分散型交流カフェ </div>
   
   <div style={{textShadow:"3px 3px black",paddingTop:"100px"}}> Please connect your wallet to continue</div>    
        <br/>
        <button className="login-button" onClick={() => startLogin()}> Login </button>
        </div>
        </div>
        
    );
    }
  
  if(login == 0) return (<Login/>
  )
  if(login == 1) return (<LoginFade/>);
  if(login == 2)
  return (<Game/>)

}

