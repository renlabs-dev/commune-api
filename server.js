const express = require("express");
const { ApiPromise, WsProvider } = require("@polkadot/api");

const app = express();
const port = 3000;

async function getCirculatingSupply() {
  const wsProvider = new WsProvider(
    "wss://commune.api.onfinality.io/public-ws"
  );
  const api = await ApiPromise.create({ provider: wsProvider });

  const totalBalance = await api.query.balances.totalIssuance();
  const totalStakeEntries = await api.query.subspaceModule.totalStake.entries();

  let totalStakeSum = api.createType("Balance", 0);
  totalStakeEntries.forEach(([key, value]) => {
    totalStakeSum = totalStakeSum.add(value);
  });

  const circulatingSupply = totalBalance.add(totalStakeSum);

  await api.disconnect();

  // convert from nano
  return circulatingSupply / 10 ** 9;
}

function MaxSupply() {
  return 1_000_000_000;
}

function TotalSupply() {
  return 1_000_000_000;
}

app.get("/api/circulating-supply", async (req, res) => {
  try {
    const supply = await getCirculatingSupply();
    res.json({ circulatingSupply: supply.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching circulating supply");
  }
});

app.get("/api/max-supply", async (req, res) => {
  try {
    const supply = await MaxSupply();
    res.json({ maxSupply: supply.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching max supply");
  }
});

app.get("/api/total-supply", async (req, res) => {
  try {
    const supply = await TotalSupply();
    res.json({ totalSupply: supply.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching total supply");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
