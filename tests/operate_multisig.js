// Import the necessary modules from Polkadot.js
const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
    // Connect to the node
    const provider = new WsProvider('wss://commune.api.onfinality.io/public-ws');
    const api = await ApiPromise.create({ provider });

    // Address of the multisig account
    // const multisigAddress = '5HhhYz19vspXiUZbkiPrJYgZN4xFVzXcTwXaKEouTgoKACiC';

    // Addresses of the signatories and the threshold
    const otherSignatories = ['5E7siV4YTJRn1yNP7JnJE43votSQShjinTu6Dgu69sXd1UXF', '5D4xmWFyu44c3GqkU5ixo9pgyr7vpHjBGDhboNaUgTMmXdYA'];
    const threshold = 2; // Number of signatures required

    // Destination address and amount to transfer
    const recipientAddress = '5HmAMPi6Koo34Sy5oyHgqwv6MM7B9JHVfda5LHi1atVmfX3m';
    const amount = 1 * 10 ** 9; // 1 token

    // Create a multisig transfer call
    const transferCall = api.tx.balances.transfer(recipientAddress, amount);

    // Create the multisig transaction
    const tx = api.tx.multisig.asMulti(threshold, otherSignatories, null, transferCall.toHex(), false, 1000000000000);

    console.log(`Transaction hash: ${tx.hash.toHex()}`);
}

main().catch(console.error);
