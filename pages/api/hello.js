// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from "ethers";

const cSigns = async (signer,c,n)=>{
  let signature;
// All properties on a domain are optional
console.log(n.chainId);
const domain = {
  name: "MetaDAO",
  version: '1',
  chainId: '97',
  verifyingContract: c
};

// The named list of all type definitions
//mint(address receiver,uint256 amount)
const types = {

  mint: [
      { name: 'receiver', type: 'address' },
      { name: 'amount', type: 'uint256' }
  ]
};

// The data to sign
//      {t: 'address', v: recipient.address},
//      {t: 'uint256', v: recipient.totalAllocation.toString()}
const value = {
  
      receiver: '0xF243Bd5352DA9835F0Aa47cE690e36Dc485CA0a5',
      amount: "10"
  
};

signature = await signer._signTypedData(domain, types, value);
//console.log(signature);
const sig0 = signature.substring(2);
const r = "0x" + sig0.substring(0, 64);
const s = "0x" + sig0.substring(64, 128);
const v = parseInt(sig0.substring(128, 130), 16);
console.log(signature,r,s,v);
sign = signature;

return;
}

export default function handler(req, res) {
 
}
