import smartpy as sp

# FA2 = sp.io.import_template("FA2.py")
FA2 = sp.io.import_script_from_url("file:helpers/FA2.py")
 
class Token(FA2.FA2):
    pass
 
@sp.add_test(name="tests")
def test():
    jerry = sp.test_account("Jerry")
    tom = sp.test_account("Tom")
    admin = sp.address("tz1VVhMixDYii3ECkdyq6gktjnsUuYqyMu7T")
    scenario = sp.test_scenario()
    scenario.h1("tutorial tests")
    token = Token(FA2.FA2_config(single_asset=True), admin=admin, metadata= sp.big_map({"": sp.utils.bytes_of_string("tezos-storage:content"),"content": sp.utils.bytes_of_string("""{"name": "Tutorial Contract", "description": "Fungible Token contract for the tutorial"}""")}))
    scenario += token
    token.mint(token_id=0, address=jerry.address, amount=1, metadata = sp.map({"": sp.utils.bytes_of_string("ipfs://bafkreih36m3d4yfbpyteluvntuph5xybwtgxdvyksbgyg66es44drk4hqy")})).run(sender=admin)
    token.mint(token_id=0, address=tom.address, amount=10, metadata = sp.map({"": sp.utils.bytes_of_string("ipfs://bafkreih36m3d4yfbpyteluvntuph5xybwtgxdvyksbgyg66es44drk4hqy")})).run(sender=admin)

    token.transfer([
        token.batch_transfer.item(
            from_ = tom.address,
            txs = [
                sp.record(to_=jerry.address, amount=2, token_id=0)
            ])
    ]).run(sender = admin)

    scenario.show(token.data)

    sp.add_compilation_target("token", Token(FA2.FA2_config(single_asset=True), admin=admin, metadata= sp.big_map({"": sp.utils.bytes_of_string("tezos-storage:content"),"content": sp.utils.bytes_of_string("""{"name": "Tutorial Contract", "description": "Fungible Token contract for the tutorial"}""")})))