import React, { useEffect } from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/home/Home.jsx';
import Char2Bytes from './components/char2Bytes/Char2Bytes.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoaded, setStorage } from './store/reducers/storage.js';
import { getActiveAccount, getClaimedAccounts } from './utils/wallet.js';
import Create from './components/Create/Create.jsx';
import Originate from './components/Originate/Originate';
import { removePKH, setPKH } from './store/reducers/walletSlice';
import Drop from './components/Drop/Drop';
import DropForm from './components/DropForm/DropForm';

const App = () => {

    const loaded = useSelector(selectLoaded);
    const dispatch = useDispatch();
    useEffect(() => {
        try {
            const func = async () => {
                const accounts = await getClaimedAccounts();
                dispatch(setStorage(accounts));
            };
            if (!loaded) {
                func();
            }
        } catch (err) {
            console.log(err);
        }
    }, [dispatch, loaded]);

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

    return (
        <div>
            <Router>
                <Navbar />
                <video playinline="true" autoPlay muted loop id="bgvid">      
                    <source src="/Black.mp4" type="video/mp4" />
                </video>
                <Switch>
                    <Route exact component={Char2Bytes} path="/char2Bytes" />
                    <Route exact component={Create} path="/create" />
                    <Route exact component={Originate} path="/originate" />
                    <Route exact component={DropForm} path="/drop" />
                    <Route exact component={Drop} path="/drop/:contract/:ipfs" />
                    <Route exact component={Home} path="/" />
                </Switch>
            </Router>
        </div>
    );
};

export default App;
