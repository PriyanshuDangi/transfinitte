import smartpy as sp

MerkleTree = sp.io.import_script_from_url("file:helpers/merkle_tree.py").MerkleTree
FA2 = sp.io.import_script_from_url("file:helpers/FA2.py")

class ErrorMessage:
    ALREADY_CLAIMED="ALREADY_CLAIMED"
    INVALID_PROOF="INVALID_PROOF"
    INVALID_LEAF="INVALID_LEAF"


class TokenMinter(sp.Contract):
    def __init__(
        self,
        token_address,
        merkle_root=sp.bytes("0x00"),
        claimed=sp.big_map(l={}, tkey=sp.TAddress, tvalue=sp.TUnit),
    ):
        self.init(
            token_address=token_address,
            merkle_root=merkle_root,
            claimed=claimed,
        )

    @sp.entry_point
    def claim(self, params):
        sp.set_type(params, sp.TRecord(proof=sp.TList(sp.TBytes), leaf=sp.TBytes).layout(("proof", "leaf")))

        # Verify that the user has not already claimed
        sp.verify(~self.data.claimed.contains(sp.sender), ErrorMessage.ALREADY_CLAIMED)

        # Verify that the computed merkle root from proof matches the actual merkle root
        sp.verify(
            MerkleTree.compute_merkle_root(params.proof, params.leaf) == self.data.merkle_root,
            ErrorMessage.INVALID_PROOF,
        )

        # Unpack leaf data
        leaf_data = sp.unpack(params.leaf, sp.TRecord(address=sp.TAddress, value=sp.TNat).layout(("address", "value"))).open_some(ErrorMessage.INVALID_LEAF)

        # Verify that the address provided in the leaf matches the sender
        sp.verify(leaf_data.address == sp.sender, ErrorMessage.INVALID_LEAF)

        # Mint the token at the sender's address
        token_contract = sp.contract(sp.TRecord(
                                        address=sp.TAddress, 
                                        amount=sp.TNat, 
                                        token_id=sp.TNat, 
                                        metadata = sp.TMap(sp.TString, sp.TBytes)),
                                        self.data.token_address,
                                        entry_point="mint"
                                    ).open_some()

        sp.transfer(sp.record(address=sp.sender,
                            amount=leaf_data.value, 
                            token_id=0,
                            metadata=FA2.FA2.make_metadata(name="Tutorial", decimals=6, symbol="TUT")
                            ), sp.mutez(0), token_contract)

        # Mark as claimed
        self.data.claimed[sp.sender] = sp.unit


@sp.add_test(name="test")
def test():
    scenario = sp.test_scenario()

    elon = sp.address("tz1eUzpKnk5gKLYw4HWs2sWsynfbT7ypGxNM")
    jeff = sp.address("tz1fxRWk1b53H3RLVxuipjCJJghPmzju7zQA")

    elon_proof = [
        sp.bytes("0x4ef76d73abb14194755febcf8830493a021ef08c5477823e409ecb1aac86de79"),
        sp.bytes("0x2800b79312399df0116736073b3c468fb4ebd3c791624bdcc1db2d3cbe5ffc58"),
    ]
    jeff_proof = [
        sp.bytes("0x8630b4452805c75bdab9da5d09dc1cfd4fcbd971e397af31fab3ee7421ae745a"),
        sp.bytes("0x555a4df967eca2f3e44cb4930abd5ca5202d0b76a822bd30cbaea05dbec40d02"),
    ]

    elon_leaf = sp.pack(sp.record(address=elon, value=sp.nat(200)))
    jeff_leaf = sp.pack(sp.record(address=jeff, value=sp.nat(300)))


    # change before deploying
    admin = sp.address("tz1aV2DuPYXEK2mEVc4VBhP9o4gguFGxBky4")
    token_address = sp.address("KT1MPHyxtddEAt1cJKrNZArMBooF6G86uHan")
    merkle_root = sp.bytes("0x83e3763b42f4e89fbf5cb200c15ce03f2fe116c912fa7098f9970ff8d3db2ca3")

    token = FA2.FA2(
            FA2.FA2_config(single_asset=True, add_mutez_transfer=True),
            sp.utils.metadata_of_url("ipfs://QmWVWR4q2Lqtwmn84yMs7fLjTVbHbqfHcQdBTNn6ZHALmu"),
            admin,
        )
    scenario += token

    minter = TokenMinter(token_address=token.address, merkle_root=merkle_root)

    scenario += minter

    # scenario += token.mint(
    #                 address=minter.address,
    #                 amount=1000,
    #                 metadata=FA2.FA2.make_metadata(name="Tutorial", decimals=6, symbol="TUT"),
    #                 token_id=0,
    #             ).run(sender=admin)

    token.set_administrator(minter.address).run(sender=admin)

    # Elon claiming his token
    scenario += minter.claim(proof=elon_proof, leaf=elon_leaf).run(
                    sender=elon
                )

    # Fail: Elon trying again
    scenario += minter.claim(proof=elon_proof, leaf=elon_leaf).run(
                    sender=elon, valid=False
                )

    # Fail: Jeff trying with wrong proof
    scenario += minter.claim(proof=elon_proof, leaf=jeff_leaf).run(
                    sender=jeff, valid=False
                )

    # Jeff claiming hit tokens
    scenario += minter.claim(proof=jeff_proof, leaf=jeff_leaf).run(
                    sender=jeff
                )

    sp.add_compilation_target("token_drop_fa2", TokenMinter(token_address=token_address, merkle_root=merkle_root))
