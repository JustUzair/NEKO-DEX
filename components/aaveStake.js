import React, { useState } from 'react';


export const AaveStake = () => {

    const [showDepositeOrWithdraw, setShowDepositeOrWithdraw] = useState(true);

    const Deposit =() => {
        return( <div>
         Deposit
         </div>)
     }
     const Withdraw = () => {
       return( <div>
      withdraw
       </div> )
     }


    return (<div>
        <div className="modal" style={{marginTop:"0px"}}>  
        <div className="modal-content"> 
        


        {showDepositeOrWithdraw && <Deposit/>}  
        {!showDepositeOrWithdraw && <Withdraw/>}

        <button className="modalButton" onClick={() => setShowDepositeOrWithdraw(true)}>Deposit</button>
        <button className="modalButton" onClick={() => setShowDepositeOrWithdraw(false)}>Withdraw</button>
        </div>
        </div>
      </div>)





}
