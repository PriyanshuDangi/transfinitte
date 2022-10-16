import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import * as config from '../config/config';
import { bytes2Char, char2Bytes } from '@taquito/utils';
import axios from 'axios';

const Tezos = new TezosToolkit(config.RPC_URL);

const options = {
    name: config.NAME,
    iconUrl: 'https://tezostaquito.io/img/favicon.png',
    preferredNetwork: config.NETWORK,
};

const wallet = new BeaconWallet(options);

Tezos.setWalletProvider(wallet);

const connectWallet = async () => {
    await wallet.requestPermissions({
        network: {
            type: config.NETWORK,
        },
    });
    return wallet;
};

const disconnectWallet = async () => {
    await wallet.clearActiveAccount();
};

const getActiveAccount = async () => {
    const activeAccount = await wallet.client.getActiveAccount();
    return activeAccount;
};

const getPKH = async () => {
    const pkh = await wallet.getPKH();
    return pkh;
};

const getContract = async (contract_address) => {
    const address = contract_address || config.CONTRACT_ADDRESS;
    const contract = await Tezos.wallet.at(address);
    return contract;
};

const getClaimedAccounts = async (contract_address) => {
    const address = contract_address || config.CONTRACT_ADDRESS;
    const response = await axios.get(
        `https://api.ghostnet.tzkt.io/v1/contracts/${address}/bigmaps/claimed/keys`
    );
    const data = response.data;
    let accounts = {};
    for (let i = 0; i < data.length; i++) {
        accounts[data[i].key] = true;
    }
    return accounts;
};

const claimTokens = async (proof, leaf, contract_address) => {
    const contract = await getContract(contract_address);
    const op = await contract.methods.claim(proof, leaf).send();
    return await op.confirmation(1);
}

const originateMinter = async (code, storage) => {
    try {
        console.log("started")
        const op = await Tezos.wallet
            .originate({
                code: code,
                storage: storage,
            })
            .send()
        console.log(`Waiting for confirmation of origination...`);
        const contract = await op.contract();
        console.log(`Origination completed for ${contract.address}.`);
        return contract.address

    } catch (err) {
        console.log(err);
    }
}

export { connectWallet, disconnectWallet, getActiveAccount, getPKH, getContract, claimTokens, getClaimedAccounts, originateMinter };
