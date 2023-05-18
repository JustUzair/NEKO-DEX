import { ST } from 'next/dist/shared/lib/utils';
import React, { useState } from 'react';
export const Leaderboard = () => {

    const [activeTab, setActiveTab] = useState(1);


    const Buttons = () => {
        return (
            <div style={{padding:"15px"}}>
                {/* <button className="modalButton" onClick={() => setActiveTab(1)}>Leaderboard</button> */}
                {/* <button className="modalButton" onClick={() => setActiveTab(2)}>Stake LP</button>
                <button className="modalButton" onClick={() => setActiveTab(3)}>Unstake LP</button> */}
            </div>

        )
    }

    const StakeLP = () => {
        return (
            <div style={{display:"flex", justifyContent:"center"}}>
            <div style={{padding:"15px",margin:"15px", border:"1px solid black", borderRadius:"6px"
            ,maxWidth:"50%"}}>
                <h1>Stake LP</h1>
                
                Stake any of your NEKO LP tokens to earn points!
                <br/>
                {/* Choose which LP to stake in a dropdown Menu */}
                <br/>
                <select>
                    <option value="WETHUSDC">WETHUSDC</option>
                    <option value="WBTCUSDC">WBTCUSDC</option>
                    <option value="OPUSDC">OPUSDC</option>
                    <option value="DAIUSDC">DAIUSDC</option>
                </select>
                <br></br>
                
                <br></br>
                <input type="text" placeholder="Amount to Stake"></input>
<br/>                <button>Stake</button>
                <br></br>
                <br></br>

            </div>
            <Stakes/>
            </div>)
            }

    const UnstakeLP = () => {
        return (
            <div style={{display:"flex", justifyContent:"center"}}>
            <div style={{padding:"15px",margin:"15px", border:"1px solid black", borderRadius:"6px"
            ,maxWidth:"50%"}}>
                <h1>Unstake LP</h1>
                Unstake your NEKO LP tokens
                <br/>
                <br/> <br/>
                {/* Choose which LP to unstake in a dropdown Menu */}
                <select>
                    <option value="WETHUSDC">WETHUSDC</option>
                    <option value="WBTCUSDC">WBTCUSDC</option>
                    <option value="OPUSDC">OPUSDC</option>
                    <option value="DAIUSDC">DAIUSDC</option>
                </select>
                <br></br>
                <br></br>
                <input type="text" placeholder="Amount to Unstake"></input>
                <button>Unstake</button>
                <br></br>
                <br></br>
                </div>
                <Stakes/>
                </div>)
                }

    const Stakes = () => {
        return (
            <div style={{padding:"15px",margin:"15px", border:"1px solid black", borderRadius:"6px"
            ,maxWidth:"50%"}}>
                <h4>Your LP Tokens</h4>

                <table>
                    <tr>
                        <th>LP Token</th>
                        <th>Unstaked</th>
                        <th>Staked</th>
                    </tr>
                    <tr>
                        <td>WETHUSDC</td>
                        <td>1000</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>WBTCUSDC</td>
                        <td>1000</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>MATICUSDC</td>
                        <td>1000</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>DAIUSDC</td>
                        <td>1000</td>
                        <td>1000</td>
                    </tr>
                </table>

            


                </div>)
    }



    const Top10 = () => {
        return (
            <>
            
            <div style={{padding:"15px",margin:"15px", borderRadius:"6px"}}>
             
              <div style={{fontSize: "30px"}}>Leaderboard </div>
              
              {/* <div style={{fontSize: "10px"
              ,width:"150px",
               border: "black solid 1px", 
               marginTop:"-30px", 
               marginLeft:"450px", 
               padding:"5px"}}>Users who own the most <br/> LP tokens will be listed here</div>  
                 */}
                <table style={{background:"white", boxShadow:"inset 0 0 6px black", borderRadius:"6px"}}>
                    
                    <tr>
                        <th>Rank</th>
                        <th>Address</th>
                        <th>Points</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>gas-limit.eth</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>JustUzair.eth</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Inzhagi.eth</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>0x1234...5678</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>0x1234...5678</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>0x1234...5678</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>0x1234...5678</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>0x1234...5678</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>0x1234...5678</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                    <td>10</td>
                    <td>0x1234...5678</td>
                    <td>1000</td>
                    </tr>

        
                </table>
                

            
            </div>
            <div className="infoPanelLeaderboard">
      <div className="typedOutWrapperLeaderboard">
        <div className="typedOutInfo">  
        🏆 The Top 10 liquidity providers
      </div>
      </div>
      </div>
          </>  )
    }
    if(activeTab === 1) {
        return (
            <>
            <Top10 />
            <Buttons/>
            </>
        )
    }
    // if(activeTab == 2) {
    //     return(
    //     <>
    //     <StakeLP/>
    //     <Buttons/>
    //     </>
    //     )

    // }
    // if(activeTab == 3) {
    //     return(
    //     <>
    //     <UnstakeLP/>
       
    //     <Buttons/>
    //     </>
    //     )

    // }
    }
    