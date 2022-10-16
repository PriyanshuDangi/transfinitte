import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectConnected, selectPKH } from "../../store/reducers/walletSlice";
import Claim from "../Claim/claim";

import tezosHome from "../../assets/images/tezos-home.png"

import classes from "../home/home.module.css";
import axios from "axios";
import { getClaimedAccounts } from "../../utils/wallet";
import { setStorage } from "../../store/reducers/storage";

const pinata_url = "https://gateway.pinata.cloud/ipfs/"


const Drop = (props) => {

    const contract_address = props.match.params.contract;
    const ipfs_hash = props.match.params.ipfs;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const dispatch = useDispatch();

    const isConnected = useSelector(selectConnected);
    const pkh = useSelector(selectPKH);

    const [eligible, setEligible] = useState(false);
    const [merkleData, setMerkleData] = useState({});

    useEffect(() => {
        try {
            const func = async () => {
                try {
                    setLoading(true);
                    setError(false);
                    const data = await axios.get(pinata_url + ipfs_hash);
                    setMerkleData(data.data);

                    const accounts = await getClaimedAccounts(contract_address);
                    dispatch(setStorage(accounts));

                    setLoading(false);
                } catch (err) {
                    console.log(err);
                    setLoading(false);
                    setError(true);
                }
            }

            func();
        } catch (err) {

        }
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

    if (error) {
        return "Error"
    }

    if (loading) {
        return "Loading"
    }


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

export default Drop;