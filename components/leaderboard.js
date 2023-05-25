import { ST } from "next/dist/shared/lib/utils";
import React, { useState } from "react";
export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState(1);

  const [selectedOption, setSelectedOption] = useState('nekoWETHLP');


  const Buttons = () => {
    return (
      <div style={{ padding: "15px" }}>
        <button className="modalButton" onClick={() => setActiveTab(1)}>Leaderboard</button> 
        <button className="modalButton" onClick={() => setActiveTab(2)}>Stake LP</button>
                <button className="modalButton" onClick={() => setActiveTab(3)}>Unstake LP</button>
      </div>
    );
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  let imageUrl;

  switch (selectedOption) {
    case 'nekoWETHLP':
      imageUrl = 'https://i.ibb.co/CWfhL6J/image.png';
      break;
    case 'nekoWBTCLP':
      imageUrl = 'https://i.ibb.co/YRYQ82y/image.png';
      break;
    case 'nekoMATICLP':
      imageUrl = 'https://i.ibb.co/ZLW9d4x/image.png';
      break;
    case 'nekoDAILP':
      imageUrl = 'https://i.ibb.co/26fPzxF/image.png';
      break;
    default:
      imageUrl = 'path/to/default-image.jpg';
      break;
  }

  const StakeLP = () => {
    return (
        <>
        
        <h1 style={{marginLeft:"15px", color:"white", textShadow:"4px 4px 4px black"}}>Stake LP</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
       
        <div
          style={{
            padding: "15px",
            margin: "15px",
            border: "1px solid black",
            borderRadius: "6px",
            width: "50%",
            objectPosition: "center"
          }}
        >
          <img style={{maxWidth:"100px", maxHeight: "75px", marginLeft:"100px"}} src={imageUrl} alt="Selected Image" />
          <br/>
          {/* Choose which LP to stake in a dropdown Menu */}
         
          <select value={selectedOption}
          onChange={handleSelectChange}
          style={{borderRadius:"6px",padding:"15px",background:"black", color:"white", marginLeft:"75px"}}>
            <option value="nekoWETHLP">nekoWETHLP</option>
            <option value="nekoWBTCLP">nekoWBTCLP</option>
            <option value="nekoMATICLP">nekoMATICLP</option>
            <option value="nekoDAILP">nekoDAILP</option>
          </select>
          
          <br></br>
          <br></br>

          <input style={{marginLeft:"15px"}}className="asset" type="text" placeholder="Amount to Unstake"></input>
          
          <br /> <button style={{marginLeft:"15px"}} className="swapButton">Stake</button>
          
        </div>
        <Stakes />

        
      </div>
      <div className="infoPanelLeaderboard">
          <div className="typedOutWrapperLeaderboard">
            <div className="typedOutInfo">
            ⌛ Stake your LP Tokens to gain a <br/> spot on the leaderboard! ➕ 
            </div>
          </div>
        </div>
      </>
    );
  };

  const UnstakeLP = () => {
    return (
        <>
        <h1 style={{marginLeft:"15px", color:"white", textShadow:"4px 4px 4px black"}}>Unstake LP</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
       
        <div
          style={{
            padding: "15px",
            margin: "15px",
            border: "1px solid black",
            borderRadius: "6px",
            width: "50%",
            objectPosition: "center"
          }}
        >
          <img style={{maxWidth:"100px", maxHeight: "75px", marginLeft:"100px"}} src={imageUrl} alt="Selected Image" />
          <br/>
          {/* Choose which LP to stake in a dropdown Menu */}
         
          <select value={selectedOption}
          onChange={handleSelectChange}
          style={{borderRadius:"6px",padding:"15px",background:"black", color:"white", marginLeft:"75px"}}>
            <option value="nekoWETHLP">nekoWETHLP</option>
            <option value="nekoWBTCLP">nekoWBTCLP</option>
            <option value="nekoMATICLP">nekoMATICLP</option>
            <option value="nekoDAILP">nekoDAILP</option>
          </select>
          
          <br></br>
          <br></br> 
          <br /> <button style={{marginLeft:"15px"}} className="swapButton">Unstake all</button>
        
        </div>
        <Stakes />

        
      </div>
      <div className="infoPanelLeaderboard">
          <div className="typedOutWrapperLeaderboard">
            <div className="typedOutInfo">
            ⏰ Unstake your LP Tokens and <br/> stop gaining points ❌
            </div>
          </div>
        </div>
      </>
    );
  };

  const Stakes = () => {
    return (
      <div
        style={{
          padding: "15px",
          paddingTop: "0px",
          margin: "15px",
          border: "1px solid black",
          borderRadius: "6px",
          maxWidth: "50%",
          color:"white", 
          textShadow:"4px 4px 4px black"
        }}
      >
        <h4>Your LP Tokens</h4>

        <table>
          <tr>
            <th>LP Token</th>
            <th>Unstaked</th>
            <th>Staked</th>
          </tr>
          <tr>
            <td>nekoWETHLP</td>
            <td>1000</td>
            <td>1000</td>
          </tr>
          <tr>
            <td>nekoWBTCLP</td>
            <td>1000</td>
            <td>1000</td>
          </tr>
          <tr>
            <td>nekoMATICLP</td>
            <td>1000</td>
            <td>1000</td>
          </tr>
          <tr>
            <td>nekoDAILP</td>
            <td>1000</td>
            <td>1000</td>
          </tr>
        </table>
      </div>
    );
  };

  const Top10 = () => {
    return (
      <>
        <div style={{ padding: "15px", margin: "15px", borderRadius: "6px" }}>
          <div style={{ fontSize: "30px", marginBottom:"15px", color:"white", textShadow:"4px 4px 4px black"}}>Leaderboard </div>

          {/* <div style={{fontSize: "10px"
              ,width:"150px",
               border: "black solid 1px", 
               marginTop:"-30px", 
               marginLeft:"450px", 
               padding:"5px"}}>Users who own the most <br/> LP tokens will be listed here</div>  
                 */}
          <table
            style={{
              background: "white",
              boxShadow: "inset 0 0 6px black",
              borderRadius: "6px",
            }}
          >
            <tbody>
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
            </tbody>
          </table>
        </div>
        <div className="infoPanelLeaderboard">
          <div className="typedOutWrapperLeaderboard">
            <div className="typedOutInfo">
              🏆 The Top 10 liquidity providers
            </div>
          </div>
        </div>
      </>
    );
  };
  if (activeTab === 1) {
    return (
      <>
        <Top10 />
        <Buttons />
      </>
    );
  }
  if(activeTab == 2) {
      return(
      <>
      <StakeLP/>
      <Buttons/>
      </>
      )

  }
  if(activeTab == 3) {
      return(
      <>
      <UnstakeLP/>

      <Buttons/>
      </>
      )

  }
};
