import { MichelsonMap } from "@taquito/taquito";
import { char2Bytes } from "@taquito/tzip16";
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { originateMinter } from "../../utils/wallet";
import { buildMerkle } from "./buildMerkel";
import classes from "./create.module.css"
import InputGroup from 'react-bootstrap/InputGroup';
import Accounts from "../Accounts/Accounts";
import { useSelector } from "react-redux";
import { selectConnected } from "../../store/reducers/walletSlice";
import { Alert } from "react-bootstrap";

const accounts = {
    tz1VVhMixDYii3ECkdyq6gktjnsUuYqyMu7T: "100",
    tz1irXvZiF9mngyvF2HKWJamTom643Cwn2jy: "200",
    tz1eUzpKnk5gKLYw4HWs2sWsynfbT7ypGxNM: "200",
    tz1fxRWk1b53H3RLVxuipjCJJghPmzju7zQA: "300",
    tz1VyBpzPZSpYHpqKzvVHWGs8vSuoiBHmZSN: "400",
    tz1NjRn5DNE8D4qT8irc7YLGgBcLw9yMbLkR: "100",
    tz1MVLk8rJuJV1nWkNUiw2zCKnLzZEbaBNWS: "100",
    tz1g6wiwcqYhTLuc7fsu1mYSUTkhetAVpapR: "100",
    tz1NJX6HCTA6NKC9x5N8yAGzESX78MAANq8C: "200",
    tz1Ws6ueRTDTJFmqbyVBpBdDzMdv4gHP9Ui7: "200",
    tz1MKdaywVs7v54Lor9JkgFtQp74TJ1unMqg: "100",
    tz1RybC6u12NfBBrNanar15QyRNqAtonXbxS: "100",
    tz1fg4gu3agTw4BYwySKAq5cMYMnw6wfqrQx: "100",
    tz1SfAKDHCYUYHcspc1Gxs5MDEcyiVDDq7pc: "100",
    tz1a8g3D7Eqq5cAs5TBBVHAmbjF5RzG3ADRg: "100"
}

let initial = [
    {
        address: 'tz1VVhMixDYii3ECkdyq6gktjnsUuYqyMu7T',
        amount: '100'
    },
    {
        address: 'tz1irXvZiF9mngyvF2HKWJamTom643Cwn2jy',
        amount: '100'
    }
]

const Create = () => {

    // const [json, setJson] = useState(null);
    const [accounts, setAccounts] = useState(initial);

    const isConnected = useSelector(selectConnected);

    const [data, setData] = useState(null);

    const generateTree = async () => {
        let acc = {};
        accounts.forEach((account) => {
            acc[account.address] = account.amount;
        })

        console.log(acc);
        const data = await buildMerkle(acc);
        setData(data);
    }

    // const originate = async () => {
    //     // const storage = `(Pair {} (Pair 0x83e3763b42f4e89fbf5cb200c15ce03f2fe116c912fa7098f9970ff8d3db2ca3 "KT1MPHyxtddEAt1cJKrNZArMBooF6G86uHan"))`;
    //     const claimed = new MichelsonMap();

    //     const data = await buildMerkle(accounts);

    //     const root = data.root.slice(2);

    //     setJson(data.json);

    //     return;
    // }

    const submitHandler = (event) => {
        event.preventDefault();
        const address = event.target.address.value;
        const amount = event.target.amount.value;

        event.target.address.value = '';

        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].address === address) {
                setAccounts((accounts) => {
                    const acc = [...accounts];;
                    acc[i] = { address, amount };
                    return acc;
                })
                return;
            }
        }

        setAccounts((accounts) => {
            const acc = [...accounts, { address, amount }]
            return acc;
        })
    }

    if (!isConnected) {
        return <div className={classes.full}>
            <div className={classes.center}>
                <Alert variant="light">Please Connect Your Wallet First</Alert>
            </div>
        </div>
    }

    return (<>
        <div className={classes.overlay}>
            <div className={classes.container}>

                <h2 className={classes.title}>Create Merkle Tree</h2>
                <div>
                    <Form onSubmit={submitHandler}>
                        <InputGroup className="mb-3">
                            <Form.Control type="text" placeholder="Tezos Address" name="address" required="true" />
                            <Form.Control type="number" placeholder="Amount" name="amount" required="true" any="1" min="1" />
                            <Button variant="dark" type="submit">
                                Add
                            </Button>
                        </InputGroup>
                    </Form>
                </div>

                <Accounts accounts={accounts} />

                {accounts.length > 1 && <div>
                    <Button variant="outline-light" onClick={generateTree}>Generate Root Hash</Button>
                </div>}

                {data && <div className={classes.data}>
                    <Alert>The Hash Root is {data.root.slice(2)}</Alert>

                    <div className={classes.dataButtons}>
                        <a variant="outline-light" href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(data.json, null, 2)
                        )}`}
                            download="filename.json">Download Data</a>
                        <Button variant="outline-light">Upload to IPFS</Button>
                    </div>
                </div>}
            </div>

        </div>
    </>)
}

export default Create;