import React, { useState, useEffect } from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {ethers} from "ethers";
import Web3Modal from "web3modal"
import {ABI,contract,signs} from "./contract"




export default function Home() {
  const [state, setState] = useState();
  const [assign,setAssign] = useState();
  async function init() {
    console.log("starting up");
    //console.log("WalletConnectProvider is", WalletConnectProvider);
    //console.log("Fortmatic is", Fortmatic);

    const providerOptions = {
      metamask: {},
    };

    const web3Modal = new Web3Modal({
      //network: "mainnet", // optional
      cacheProvider: false, // optional
      //disableInjectedProvider: false,
      providerOptions,
      theme: "light", // required
    });

    const provider = await web3Modal.connect();
    //console.log(provider);

    const web3 =  new ethers.providers.Web3Provider(provider);
    const signer = web3.getSigner()
    console.log(signer)
    
    const address = await signer.getAddress();

    const networkId = await web3.getNetwork();
    if (networkId.chainId !== 97) {
      alert("Switch to bsc network");
      web3Modal.clearCachedProvider();
      web3Modal.resetState();
      return;
    }
    const balance = await web3.getBalance(address);

    console.log(address);

    var bal = ethers.utils.formatEther(balance);
    console.log(bal);
    /**/
    //  console.log(networkId)
    setState({
      web3,
      provider,
      connected: true,
      address,
      bal,
      web3Modal,
      networkId,
      signer
    });
    // window.provider = provider;
    await subscribeProvider(provider);
  }

  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    // provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts) => {
      //if(state !== undefined && state.web3 !== undefined)
      //  console.log(state);
      //setProviderData({ address: accounts[0] });
      //setState({ address: accounts[0] });
      init();
    });
    provider.on("chainChanged", async (chainId) => {
      // const { web3 } = this.state;
      //const networkId = await web3.eth.net.getId();
      // setState({ chainId, networkId });
      //setProviderData({ chainId, networkId });
      init();
    });
    provider.on("networkChanged", async (networkId) => {
      //const { web3 } = this.state;
      //const chainId = await web3.eth.chainId();
      //  await this.setState({ chainId, networkId });
      //setProviderData({ chainId, networkId });
      init();
    });
    provider.on("open", () => {
      console.log("open");
    });

    // Subscribe to session disconnection/close
    provider.on("close", (code, reason) => {
      console.log(code, reason);
    });
  };

  const onConnect = async () => {
    try {
      await init();
    } catch (err) {
      console.log(err);
      alert("failed to connect");
    }
  };

  const logout = async () => {
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  const claim = async () =>{
  if(state !== undefined){
  const metaDAO = new ethers.Contract(contract, ABI, state.web3);
  const conSigner = metaDAO.connect(state.signer);
  console.log(assign.amt,assign.sign);
  conSigner.claim(assign.amt,assign.sign);
  //console.log(await metaDAO.name());}
  }
  }
const checkAddrExist =(a)=>{
  let s =  signs.filter(stu => stu.addr === a); 
  setAssign(s[0])
}

useEffect(()=>{
  if(state !==undefined){
    checkAddrExist(state.address);
  }
})

  return (
    <div className={styles.container}>
      <Head>
        <title>MetaDAI Airdrop | Demo</title>
        <meta name="description" content="Claim MetaDAO airdrops" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
         MetaDAO Airdrop DEMO
        </h1>
        <div className={styles.grid}>
          
         
        </div>


        <div className={styles.grid}>
           {state?<>
           
            <div>Connected to {state.address}</div>
            {assign?
            <div>
              <button onClick={claim}>Claim Airdrop</button>
            </div>:<>

            </>}

           </>:<>

          <button onClick={onConnect}>connect wallet</button>
          </>}
         
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
