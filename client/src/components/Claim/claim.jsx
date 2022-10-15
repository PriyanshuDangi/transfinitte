import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectStorage } from "../../store/reducers/storage";
import { selectPKH } from "../../store/reducers/walletSlice";
import { claimTokens } from "../../utils/wallet";
import { merkleData } from "../home/data";


const Claim = () => {

    const pkh = useSelector(selectPKH);

    const [loading, setLoading] = useState(false);
    const storage = useSelector(selectStorage);

    const coin = merkleData[pkh];

    const claim = async () => {
        try {
            setLoading(true);
            claimTokens(coin.proof, coin.leafDataPacked);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    if (storage[pkh]) {
        return "Already Claimed"
    }

    return <>
        <div>You are eligible to claim {coin.tokens} coins.</div>
        <div>
            <button onClick={claim}>Claim</button>
        </div>
    </>
}

export default Claim;