import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import RPToken_abi from "./Contracts/RPToken_abi.json";
import styles from "./Wallet.module.css";

const Wallet = () => {
  const contractAddress = "0x4A13Aed0c9Dfa0bF76d0D242117e03AF4562c9D9";
  const [tokenName, setTokenName] = useState("Token");
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [reciptentAdd, setReciptentAdd] = useState(null);
  const [transferAmount, setTransferAmount] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          AccountChangeHandler(result[0]);
          setConnButtonText("Wallet Connected");
        })
        .catch((e) => setErrorMessage(e.message));
    } else {
      console.log("install metamask");
      setErrorMessage("Please install Metamask");
    }
  };
  const AccountChangeHandler = (newAddress) => {
    setDefaultAccount(newAddress);
    updateEthers();
  };
  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    let tempContract = new ethers.Contract(
      contractAddress,
      RPToken_abi,
      tempSigner
    );
    setProvider(tempProvider);
    setSigner(tempSigner);
    setContract(tempContract);
  };
  useEffect(() => {
    if (contract != null) {
      updateBalance();
      updateTokenName();
      updateTokenSymbol();
    }
  }, [contract]);

  const updateBalance = async () => {
    let bal = await contract.balanceOf(defaultAccount);
    let deci = await contract.decimals();
    let tokenBalance = bal.toNumber() / Math.pow(10, deci);

    setBalance(bal.toNumber());
  };
  const updateTokenName = async () => {
    setTokenName(await contract.name());
  };

  const sendToken = async () => {
    contract
      .transfer(reciptentAdd, transferAmount)
      .then(() => {
        console.log(
          setErrorMessage(
            `${transferAmount} tokens successfully sent to ${reciptentAdd}`
          )
        );
      })
      .catch((e) => setErrorMessage(e.message));
  };

  const updateTokenSymbol = async () => {
    let symbol = await contract.symbol();
    setTokenSymbol(symbol);
  };
  return (
    <>
      <h2>{tokenName + " ERC-20 Wallet"}</h2>
      <br />
      <button className={styles.button6} onClick={connectWalletHandler}>
        {connButtonText}
      </button>
      <br />
      <br />
      <div className={styles.WalletCard}>
        <div>
          <p>Account Address : {defaultAccount}</p>
        </div>
        <div>
          <p>
            {tokenName} Balance : {balance}
          </p>
        </div>
        <div>
          <p>Symbol : {tokenSymbol}</p>
        </div>
      </div>
      <h2>Send Tokens </h2>
      <br />
      <input
        type="text"
        Placeholder="Reciptent Address"
        onChange={(e) => setReciptentAdd(e.target.value)}
      />
      <br />
      <br />
      <input
        type="text"
        Placeholder="Tokens"
        onChange={(e) => setTransferAmount(e.target.value)}
      />
      <br />
      <br />
      <button className={styles.button6} onClick={sendToken}>
        Send Tokens
      </button>
      <br />
      <br />
      <p> {errorMessage}</p>
    </>
  );
};
export default Wallet;
