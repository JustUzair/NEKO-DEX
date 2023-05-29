import { useEffect } from "react";

export const HUD = ({ chainId, globalDonations }) => {
  return (
    <div className="HUD">
      {chainId != null && (chainId == 80001 || chainId == 137) && (
        <div className="global-donations">
          Global donations : ${globalDonations && globalDonations[0]}
        </div>
      )}

      {chainId != null && (chainId == 65 || chainId == 66) && (
        <div className="global-donations">Global donations :</div>
      )}
      {/* <div className="inventory">
            <div>Inventory</div>
            <div > <img className="inventory-item" src="https://i.ibb.co/CWfhL6J/image.png"/> 10</div>
            <div ><img className="inventory-item" src="https://i.ibb.co/YRYQ82y/image.png"/> 15 </div>
            <div ><img className="inventory-item" src="https://i.ibb.co/ZLW9d4x/image.png"/> 19 </div>
            <div ><img className="inventory-item" src="https://i.ibb.co/26fPzxF/image.png"/>100</div>
          
        </div> */}
    </div>
  );
};
