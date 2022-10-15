import React from "react";

import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

import classes from "./accounts.module.css";

const Item = ({ account }) => {
    return <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
    >
        <div className="ms-2 me-auto">
            <div className="fw-bold">{account.address}</div>
            {/* Amount: {account.amount} */}
        </div>
        <Badge bg="primary" pill>
            {account.amount}
        </Badge>
    </ListGroup.Item>
}

const Accounts = ({ accounts }) => {
    return (
        <div className={classes.container}>
            <ListGroup as="ol" numbered>
                {Object.keys(accounts).map((key, index) => {
                    let account = accounts[key];
                    return <Item account={account} key={index} />
                })}
            </ListGroup>
        </div>
    )
}

export default Accounts;