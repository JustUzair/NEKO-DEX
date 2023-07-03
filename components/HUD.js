import { useEffect } from "react";

export const HUD = ({
  chainId,
  globalDonationsOKX,
  globalDonationsPolygon,
  totalDonationsInUSD,
  withdrawCharityAmount,
}) => {
  return (
    <div className="HUD">
      {chainId != null && (chainId == 80001 || chainId == 137) && (
        <div className="global-donations">
          Global donations : $
          {globalDonationsPolygon && globalDonationsPolygon[0]}
        </div>
      )}

      {chainId != null &&
        (chainId == 65 ||
          chainId == 66 ||
          chainId == 4002 ||
          chainId == 250) && (
          <div className="global-donations okc-global--donation">
            Global donations (Hover here)
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexDirection: "column",
              }}
            >
              {globalDonationsOKX.length > 0 &&
                globalDonationsOKX.map((item, index) => (
                  <span
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0 20px",
                    }}
                  >
                    <span
                      style={{
                        width: "40%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textAlign: "left",
                      }}
                    >
                      {item?.donationTokenSymbol}{" "}
                      <img
                        src={item?.donationTokenImage}
                        alt={item?.donationTokenSymbol}
                        width={"20px"}
                      />
                    </span>{" "}
                    <span
                      style={{
                        fontWeight: "500",
                        textDecoration: "underline",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                      title={item?.donatedTokenAmount}
                    >
                      {" "}
                      {item?.donatedTokenAmount.substr(0, 8) + "..."}
                    </span>
                  </span>
                ))}
              <span
                style={{
                  margin: "0 auto",
                }}
              >
                Total Donations in USD ~${totalDonationsInUSD}
              </span>
            </div>
          </div>
        )}
      {/* <div className="inventory">
            <div>Inventory</div>
            <div > <img className="inventory-item" src="https://i.ibb.co/CWfhL6J/image.png"/> 10</div>
            <div ><img className="inventory-item" src="https://i.ibb.co/YRYQ82y/image.png"/> 15 </div>
            <div ><img className="inventory-item" src="https://i.ibb.co/ZLW9d4x/image.png"/> 19 </div>
            <div ><img className="inventory-item" src="https://i.ibb.co/26fPzxF/image.png"/>100</div>
          
        </div> */}
      <button
        className="withdraw-donation--amount"
        style={{
          border: "1px solid white",
          margin: "0px auto",
          width: "max-content",
          padding: "5px 3px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8567f",
          color: "white",
          borderRadius: "3px",
          cursor: "pointer",
          position: "absolute",
          top: ".12%",
          right: "0",
        }}
        onClick={withdrawCharityAmount}
      >
        Withdraw Donations
      </button>
    </div>
  );
};
