const { ApiPromise, Keyring } = require('@polkadot/api');
const { WsProvider } = require('@polkadot/rpc-provider');
const { formatBalance } = require('@polkadot/util/format')

const main = async () => {
  const nodeWs = "ws://127.0.0.1:9944"
  const provider = new WsProvider(nodeWs);

  const api = await ApiPromise.create({ provider });


  const keyring = new Keyring({ type: 'sr25519' });
  // 1. Usa o formatBalance para exibir os valores


  // 2. Define as constantes relevantes
  const THRESHOLD = 2;
  const MAX_WEIGHT = { refTime: 1_000_000_000, proofSize: 10_000 };
  const AMOUNT_TO_SEND = 10_000;
  const MULTISIG = "5HhhYz19vspXiUZbkiPrJYgZN4xFVzXcTwXaKEouTgoKACiC";
  const displayAmount = formatBalance(AMOUNT_TO_SEND);
  // 3. Inicializa as contas

  const Alice = keyring.addFromUri("able fat any bar shed void thank soul curtain diet kitten reason");
  const Bob = keyring.addFromUri("soup what staff swear loan virus sense together vintage observe account solid");
  const Charlie = keyring.addFromUri("tooth elbow hobby sheriff speak purity record peasant side scout machine away");


  const otherSignatories = [
    Alice.address,
    Charlie.address,
  ].sort();

  const receiver = "5DNoACt4AB3heoizdqUvRu3CMmoMbfMzHhfH568nnrJXB97C"
  // 4. Envia 1 WND para a conta  Charlie 
  const call = api.tx.balances.transfer(receiver, AMOUNT_TO_SEND);

  // 5. Recupera e desempacota o ponto de parada

  const info = await api.query.multisig.multisigs(MULTISIG, call.method.hash);
  const TIME_POINT = info.unwrap().when;
  console.log(`Time point is: ${TIME_POINT}`);

  // 6. Envia a transação asMulti 
  //Agora a chamada multisig que foi iniciada pela conta da Alice envia 1  WND para Charlie que  é aprovado pelo Bob.
  // Como o limite é definido como 2 , essa aprovação deve enviar a chamada  
  // (Recebimento de 2 chamadas) 

  const txHash = await api.tx.multisig
    .asMulti(THRESHOLD, otherSignatories, TIME_POINT, call.method.toHex(), MAX_WEIGHT)
    .signAndSend(Bob);
  console.log(`Sending ${displayAmount} from ${MULTISIG} to ${receiver}`);
  console.log(`Required values  : asMulti(THRESHOLD, otherSignatories, TIME_POINT, call.method.hash, MAX_WEIGHT)`);
  console.log(`Submitted values : asMulti(${THRESHOLD}, otherSignatories: ${JSON.stringify(otherSignatories, null, 2)}, ${TIME_POINT}, ${call.method.hash}, ${MAX_WEIGHT})\n`);
  console.log(`asMulti tx: https://westend.subscan.io/extrinsic/${txHash}`);
}
main().catch((err) => { console.error(err) }).finally(() => process.exit());