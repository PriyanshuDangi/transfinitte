import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removePKH, selectConnected, selectPKH, setPKH } from "../../store/reducers/walletSlice";
import { getActiveAccount } from "../../utils/wallet";
import Claim from "../Claim/claim";
import { merkleData } from "./data";

import classes from "./home.module.css"


const Home = () => {
    const dispatch = useDispatch();

    const isConnected = useSelector(selectConnected);
    const pkh = useSelector(selectPKH);

    const [eligible, setEligible] = useState(false);

    useEffect(() => {
        async function func() {
            const activeAccount = await getActiveAccount();
            if (activeAccount) {
                const address = activeAccount.address;
                dispatch(setPKH(address));
            } else {
                dispatch(removePKH());
            }
        }
        func();
    }, []);


    const isELigible = () => {
        let answer = false;
        Object.keys(merkleData).forEach((key) => {
            console.log(key)
            if (key === pkh) answer = true;
        })
        return answer;
    }

    useEffect(() => {
        setEligible(isELigible());
    }, [pkh]);


    return (
        <div className={classes.full}>
            <div className={classes.container}>
                {
                    isConnected ?
                        eligible ? <Claim /> : "Not Eligible" :
                        <div>Please Connect Your Wallet First</div>
                }
            </div>
        </div>
    )
}

export default Home;