// import fse from "fs-extra";
import CryptoJS from "crypto-js";
import { MerkleTree } from "merkletreejs";
import { packDataBytes } from "@taquito/michel-codec";

// Accounts data
// import Accounts from "./account.js";

export const buildMerkle = async (Accounts) => {
    const packedList = [];
    const dropAddresses = Object.keys(Accounts);
    for (const address of dropAddresses) {
        const pack = packDataBytes(
            {
                prim: "Pair",
                args: [{ string: address }, { int: Accounts[address] }],
            },
            {
                prim: "pair",
                args: [{ prim: "address" }, { prim: "nat" }],
            }
        );
        packedList.push(pack.bytes);
    }

    const leaves = packedList.map((x) => CryptoJS.SHA256(CryptoJS.enc.Hex.parse(x)));
    const tree = new MerkleTree(leaves, CryptoJS.SHA256, { sort: true });

    // Data specification
    //  Tezos address => Merkle proof & assocaited leaf data (Michelson packed)
    const mrklData = {};

    // Loop through addresses and store proofs and leaves in mrklData
    for (let i = 0; i < dropAddresses.length; i++) {
        mrklData[dropAddresses[i]] = {
            tokens: Accounts[dropAddresses[i]],
            proof: tree.getHexProof(leaves[i].toString()).map((proof) => proof.slice(2)),
            leafDataPacked: packedList[i],
        };
    }

    // fse.outputFile(
    //     "./mrklData.json",
    //     JSON.stringify(mrklData, null, 2),
    //     (err) => {
    //         if (err) console.log(err);
    //     }
    // );

    return {
        root: tree.getHexRoot(),
        json: mrklData
    };
};
