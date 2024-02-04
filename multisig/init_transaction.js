const { ApiPromise, Keyring } = require('@polkadot/api');
const { WsProvider } = require('@polkadot/rpc-provider');
const { formatBalance } = require('@polkadot/util/format')

const main = async () => {

  const nodeWs = "ws://127.0.0.1:9944"
  const provider = new WsProvider(nodeWs);

  const api = await ApiPromise.create({ provider });

  const keyring = new Keyring({ type: 'sr25519' });
  // 1. Use formatBalance para exibir os valores


  // 2. Define constantes relevantes

  const THRESHOLD = 2;
  const MAX_WEIGHT = { refTime: 1_000_000_000, proofSize: 0 };
  const AMOUNT_TO_SEND = 10_000;
  const MULTISIG = "5HhhYz19vspXiUZbkiPrJYgZN4xFVzXcTwXaKEouTgoKACiC";
  const displayAmount = (AMOUNT_TO_SEND);
  const depositBase = api.consts.multisig.depositBase;
  const depositFactor = api.consts.multisig.depositFactor;


  // 3. Inicializa as contas 

  // YEAH , I don't care if you copy the mnemonics, this is testnet 
  // # FUNDS ARE SAFU !
  const Alice = keyring.addFromUri("able fat any bar shed void thank soul curtain diet kitten reason");
  const Bob = keyring.addFromUri("soup what staff swear loan virus sense together vintage observe account solid");
  const Charlie = keyring.addFromUri("tooth elbow hobby sheriff speak purity record peasant side scout machine away");

  const otherSignatories = [
    Bob.address,
    Charlie.address,
  ].sort();



  // 4. Chamadas API - dados são necessários para o timepoint

  const receiver = "5DNoACt4AB3heoizdqUvRu3CMmoMbfMzHhfH568nnrJXB97C"
  const call = api.tx.balances.transfer(receiver, AMOUNT_TO_SEND);
  const info = await api.query.multisig.multisigs(MULTISIG, call.method.hash);
  // 5. Define o timepoint
  // se esta É a primeira aprovação estão deve retornar  None (null)
  const TIME_POINT = null;
  // Se esta  NÃO é a primeira aprovação então deve retornar Some
  // Com o timepoint  (número do bloco e índice da transação), da primeira transação de aprovação
  // const TIME_POINT = info.unwrap().when;
  // 6. approveAsMulti 
  const txHash = await api.tx.multisig
    .approveAsMulti(THRESHOLD, otherSignatories, TIME_POINT, call.method.hash, MAX_WEIGHT)
    .signAndSend(Alice);
  console.log(`depositBase   : ${depositBase}`);
  console.log(`depositFactor : ${depositFactor}`);
  console.log(`Sending ${displayAmount} from ${Alice.address} to ${MULTISIG}`);
  console.log(`Required values  : approveAsMulti(THRESHOLD, otherSignatories, TIME_POINT, call.method.hash, MAX_WEIGHT)`);
  console.log(`Submitted values : approveAsMulti(${THRESHOLD}, otherSignatories: ${JSON.stringify(otherSignatories, null, 2)}, ${TIME_POINT}, ${call.method.hash}, ${MAX_WEIGHT})\n`);
  console.log(`approveAsMulti tx: https://westend.subscan.io/extrinsic/${txHash}`);
};
main().catch((err) => { console.error(err) }).finally(() => process.exit());