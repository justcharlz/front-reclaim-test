import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers, Wallet} from 'ethers';
import {signatures} from '@questbook/reclaim-crypto-sdk'

export const generateWallet = async() => {
  console.log('generating wallet...')
  const wallet = Wallet.createRandom();
  console.log('wallet generated', wallet)

  const publicKey = await signatures.getPublicKey(wallet.privateKey);
  const pubKey = Buffer.from(publicKey).toString('hex')
  // Buffer.from(pubKey, 'hex')

  return {
    publicKey: pubKey,
    privateKey: wallet.privateKey,
  };
};

export const getWalletFromPrivateKey = (privateKey: string) => {
  const wallet = new ethers.Wallet(privateKey);
  return wallet
}
