import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removePKH, selectConnected, selectPKH, setPKH } from "../../store/reducers/walletSlice";
import { getActiveAccount } from "../../utils/wallet";
import Claim from "../Claim/claim";
import { merkleData } from "./data";

import tezosHome from "../../assets/images/tezos-home.png"

import classes from "./home.module.css"


const Home = () => {

    const isConnected = useSelector(selectConnected);
    const pkh = useSelector(selectPKH);

    const [eligible, setEligible] = useState(false);


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

                <div className={classes.top}>
                    A blockchain designed to evolve.
                </div>
                <div className={classes.middle}>
                    Security focused. Upgradeable. Built to last.
                </div>
                <div className={classes.last}>
                    <div>
                        {
                            isConnected ?
                                eligible ? <Claim /> : "Not Eligible" :
                                <div>Please Connect Your Wallet First</div>
                        }
                    </div>

                </div>

            </div>
            <div className={classes.tezosImgContainer}>
                <img src={tezosHome} alt="tezos-home" className={classes.tezosImg} />
            </div>
        </div>
    )
}

export default Home;