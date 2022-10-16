import { MichelsonMap } from "@taquito/taquito";
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import classes from "./dropform.module.css"
import { useSelector } from "react-redux";
import { selectConnected } from "../../store/reducers/walletSlice";

const DropForm = (params) => {
    console.log(params);
    const [message, setMessage] = useState(null);

    const isConnected = useSelector(selectConnected);

    const generateLink = (contract, ipfs_hash) => {
        const url = window.location.href + "/" + contract + "/" + ipfs_hash;
        setMessage("URL to your DROP is " + url);
        return url;
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const contract = event.target.contract.value;
        const ipfs_hash = event.target.ipfs.value;

        generateLink(contract, ipfs_hash);
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

                <h2 className={classes.title}>Drop Link</h2>
                {message && <Alert variant="primary" style={{ wordWrap: "break-word" }}>{message}</Alert>}
                <div>
                    <Form className={classes.form} onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Contract Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter Contract Address" name="contract" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>IPFS Hash</Form.Label>
                            <Form.Control type="text" placeholder="Enter IPFS Hash" name="ipfs" />
                        </Form.Group>
                        <Button variant="primary" type="submit" >
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </div>

    </>

}

export default DropForm;