import React, { useEffect } from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/home/Home.jsx';
import Char2Bytes from './components/char2Bytes/Char2Bytes.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoaded, setStorage } from './store/reducers/storage.js';
import { getClaimedAccounts } from './utils/wallet.js';

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

    return (
        <div>
            <Router>
                <Navbar />
                <Switch>
                    <Route exact component={Char2Bytes} path="/char2Bytes" />
                    <Route exact component={Home} path="/" />
                </Switch>
            </Router>
        </div>
    );
};

export default App;
