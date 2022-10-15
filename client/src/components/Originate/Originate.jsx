import { MichelsonMap } from "@taquito/taquito";
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { originateMinter } from "../../utils/wallet";
import contract from "./contract/contract.json";
import classes from "./originate.module.css"
import { useSelector } from "react-redux";
import { selectConnected } from "../../store/reducers/walletSlice";

const Originate = () => {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const isConnected = useSelector(selectConnected);

    const originate = async (root, token_address) => {
        try {
            setMessage(null);
            setLoading(true);
            // const storage = `(Pair {} (Pair 0x83e3763b42f4e89fbf5cb200c15ce03f2fe116c912fa7098f9970ff8d3db2ca3 "KT1MPHyxtddEAt1cJKrNZArMBooF6G86uHan"))`;
            const claimed = new MichelsonMap();

            const storage = {
                claimed: claimed,
                merkle_root: root,
                token_address: token_address
            }
            // "KT1NDAoxkuMHqgnEg215SFhScZcLYfzfqcW3"

            const address = await originateMinter(contract, storage);

            setMessage("Your contract is successfully originated! Address is " + address);

            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const token_address = event.target.token.value;
        const root_hash = event.target.hash.value;

        originate(root_hash, token_address);
    }

    if (!isConnected) {
        return <div className={classes.full}>
            <div className={classes.center}>
                <Alert variant="light">Please Connect Your Wallet First</Alert>
            </div>
        </div>
    }

    return <>
        <div className={classes.overlay}>
            <div className={classes.container}>

                <h2 className={classes.title}>Originate Drop Contract</h2>
                {message && <Alert variant="primary">{message}</Alert>}
                <div>
                    <Form className={classes.form} onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Token Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter Token Address" name="token" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Root Hash</Form.Label>
                            <Form.Control type="text" placeholder="Enter Root Hash" name="hash" />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            Originate
                        </Button>
                    </Form>
                </div>
            </div>
        </div>

    </>

}

export default Originate;