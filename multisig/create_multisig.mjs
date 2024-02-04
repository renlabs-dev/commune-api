import { createKeyMulti } from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
import { encodeMultiAddress, decodeAddress } from "@polkadot/util-crypto";
import { ApiPromise, Keyring } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';

const nodeWs = "ws://127.0.0.1:9944"
const provider = new WsProvider(nodeWs);
const api = await ApiPromise.create({ provider });
const keyring = new Keyring({ type: 'sr25519' });
const Alice = keyring.addFromUri("able fat any bar shed void thank soul curtain diet kitten reason");
const Bob = keyring.addFromUri("soup what staff swear loan virus sense together vintage observe account solid");
const Charlie = keyring.addFromUri("tooth elbow hobby sheriff speak purity record peasant side scout machine away");

const THRESHOLD = 2;

const addresses = [
  Alice.address,
  Bob.address,
  Charlie.address
];

const multisig = encodeMultiAddress(addresses, THRESHOLD);
console.log(`Multisig Address: ${multisig}\n`);