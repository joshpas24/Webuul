import React from "react";


function ConfirmTrade({symbol, shares, price, transaction}) {

    return (
        <div>
            <h3>Confirm {transaction.title()}</h3>
            <p></p>
            <div>
                <button>{transaction}</button>
                <button>CANCEL</button>
            </div>
        </div>
    )
}
