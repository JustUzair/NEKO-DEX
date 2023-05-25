import React, { useState } from 'react';


export const AaveStake = () => {

  const [activeTab, setActiveTab] = useState(2);

  const [selectedOption, setSelectedOption] = useState('MATIC');


  const Buttons = () => {
    return (
      <div style={{ padding: "15px" }}>
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
    case 'MATIC':
      imageUrl = 'https://app.aave.com/icons/tokens/matic.svg';
      break;
    case 'WETH':
      imageUrl = 'https://app.aave.com/icons/tokens/weth.svg';
      break;
    case 'USDC':
      imageUrl = 'https://app.aave.com/icons/tokens/usdc.svg';
      break;
    case 'WBTC':
      imageUrl = 'https://app.aave.com/icons/tokens/wbtc.svg';
      break;
    case 'MaticX':
      imageUrl = 'https://app.aave.com/icons/tokens/maticx.svg';
      break;
    case 'USDT':
      imageUrl = 'https://app.aave.com/icons/tokens/usdt.svg';
      break;
    case 'DAI':
      imageUrl = 'https://app.aave.com/icons/tokens/dai.svg';
      break;
    case 'wstETH':
      imageUrl = 'https://app.aave.com/icons/tokens/wsteth.svg';
      break;
    case 'GHST':
      imageUrl = 'https://app.aave.com/icons/tokens/ghst.svg';
      break;
    case 'LINK':
      imageUrl = 'https://app.aave.com/icons/tokens/link.svg';
      break;
    case 'BAL':
      imageUrl = 'https://app.aave.com/icons/tokens/bal.svg';
      break;
    case 'EURS':
      imageUrl = 'https://app.aave.com/icons/tokens/eurs.svg';
      break;
    case 'CRV':
      imageUrl = 'https://app.aave.com/icons/tokens/crv.svg';
      break;
    case 'agEUR':
      imageUrl = 'https://app.aave.com/icons/tokens/ageur.svg';
      break;
    case 'miMATIC':
      imageUrl = 'https://app.aave.com/icons/tokens/mai.svg';
      break;
    case 'SUSHI':
      imageUrl = 'https://app.aave.com/icons/tokens/stmatic.svg';
      break;
    case 'DPI':
      imageUrl = 'https://app.aave.com/icons/tokens/dpi.svg';
      break;
    default:
      imageUrl = 'path/to/default-image.jpg';
      break;
  }

  const StakeLP = () => {
    return (
        <>
        
        <h1 style={{marginLeft:"15px", color:"white", textShadow:"4px 4px 4px black"}}>Cat toy donations
        <div style={{fontSize:"15px"}}> powered by AAVE 👻
          </div></h1>
        
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
          <img style={{width:"100px", height: "75px", marginLeft:"100px"}} src={imageUrl} alt="Selected Image" />
          <br/>
          {/* Choose which LP to stake in a dropdown Menu */}
         
          <select value={selectedOption}
          onChange={handleSelectChange}
          style={{borderRadius:"6px",padding:"15px",background:"black", color:"white", marginLeft:"75px"}}>
            <option value="MATIC">MATIC</option>
            <option value="WETH">WETH</option>
            <option value="USDC">USDC</option>
            <option value="WBTC">WBTC</option>
            <option value="MaticX">MaticX</option>
            <option value="USDT">USDT</option>
            <option value="DAI">DAI</option>
            <option value="wstETH">wstETH</option>
            <option value="GHST">GHST</option>
            <option value="LINK">LINK</option>
            <option value="BAL">BAL</option>
            <option value="EURS">EURS</option>
            <option value="CRV">CRV</option>
            <option value="agEUR">agEUR</option>
            <option value="miMATIC">miMATIC</option>
            <option value="SUSHI">SUSHI</option>
            <option value="DPI">DPI</option>

          </select>
          
          <br></br>
          <br></br>
          <input style={{marginLeft:"15px"}}className="asset" type="text" placeholder="Amount to deposit"></input>
          <br /> <button style={{marginLeft:"15px"}} className="swapButton">Deposit</button>
          
        </div>
        <Stakes />

        
      </div>
      <div className="infoPanelLeaderboard" style={{maxWidth:"350px", marginTop:"-420px", marginLeft:"320px"}}>
          <div className="typedOutWrapperLeaderboard" style={{width:"1000px"}}>
            <div className="typedOutInfo">
            ⌛ Lock your funds to generate  yields on AAVE,  <br/> which are donated to charity. User deposits <br/> are available 
            for withdrawal at any time. <br></br>Check out AAVE for the latest rates.
            
           
            </div>
          </div>
        </div>
      </>
    );
  };

  const UnstakeLP = () => {
    return (
        <>
              <h1 style={{marginLeft:"15px", color:"white", textShadow:"4px 4px 4px black"}}>Cat toy donations
        <div style={{fontSize:"15px"}}> powered by AAVE 👻
          </div></h1>
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
          <br/>
          <br/>
          <img style={{maxWidth:"100px", maxHeight: "75px", marginLeft:"100px"}} src={imageUrl} alt="Selected Image" />
          <br/>
          {/* Choose which LP to stake in a dropdown Menu */}
         
          <select value={selectedOption}
          onChange={handleSelectChange}
          style={{borderRadius:"6px",padding:"15px",background:"black", color:"white", marginLeft:"75px"}}>
            <option value="MATIC">MATIC</option>
            <option value="WETH">WETH</option>
            <option value="USDC">USDC</option>
            <option value="WBTC">WBTC</option>
            <option value="MaticX">MaticX</option>
            <option value="USDT">USDT</option>
            <option value="DAI">DAI</option>
            <option value="wstETH">wstETH</option>
            <option value="GHST">GHST</option>
            <option value="LINK">LINK</option>
            <option value="BAL">BAL</option>
            <option value="EURS">EURS</option>
            <option value="CRV">CRV</option>
            <option value="agEUR">agEUR</option>
            <option value="miMATIC">miMATIC</option>
            <option value="SUSHI">SUSHI</option>
            <option value="DPI">DPI</option>
      
          </select>
          
         
          
          <br /> <button style={{marginLeft:"15px"}} className="swapButton">Unstake all</button>
          <br/><br/>
          <br/>
        </div>
        
        <Stakes />

        
      </div>
      <div className="infoPanelLeaderboard">
          <div className="typedOutWrapperLeaderboard">
            <div className="typedOutInfo">
            ⏰ Unstake your tokens and <br/> stop donating yields ❌
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
          width: "50%",
          color:"white", 
          textShadow:"4px 4px 4px black"
        }}
      >
        <h4>Your locked assets</h4>

        <table>
          <tr>
            <th>Token</th>
          
            <th>Staked</th>
          </tr>
          <tr>
            <td>MATIC</td>
            <td>1000</td>
  
          </tr>
          <tr>
            <td>WETH</td>
            <td>1000</td>

          </tr>
          <tr>
            <td>USDC</td>
            <td>1000</td>

          </tr>
          <tr>
            <td>WBTC</td>
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
      <div className="modal"style={{top:"100px"}}>
        <div className='modal-content'>
      
        <Top10 />
        <Buttons />
        </div>
        </div>

      </>
    );
  }
  if(activeTab == 2) {
      return(
      <>
            <div className="modal"style={{top:"100px"}}>
        <div className='modal-content'>
      <StakeLP/>
      <Buttons/>
      </div>
      </div>
      </>

      )

  }
  if(activeTab == 3) {
      return(
      <>
                  <div className="modal"style={{top:"100px"}}>
        <div className='modal-content'>
      <UnstakeLP/>
      <Buttons/>
      </div>
      </div>
      </>
      )

  }
}
