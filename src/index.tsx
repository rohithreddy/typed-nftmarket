// SPDX-License-Identifier: Apache-2.0
import './index.css';
import { Provider, Signer as EvmSigner } from '@reef-defi/evm-provider';
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';



import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedExtension } from '@polkadot/extension-inject/types';
import { Identicon } from '@polkadot/react-identicon';
import { WsProvider } from '@polkadot/rpc-provider';
import { keyring } from '@polkadot/ui-keyring';
import { cryptoWaitReady, mnemonicGenerate } from '@polkadot/util-crypto';
import HeaderMain from './components/HeaderMain';
import CardColored from './components/CardColored';

// Semantic UI related imports
import 'semantic-ui-css/semantic.min.css'
import {Dropdown, Select , Segment, Card, Container, Header} from 'semantic-ui-react';


import NFT from './artifacts/contracts/NFT.sol/NFT.json'
import Market from './artifacts/contracts/Market.sol/NFTMarket.json'
import axios from 'axios';


interface Props {
  className?: string;
}

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
    whenCreated: number;
  };
}


const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Unable to find element with id \'example\'');
}

function App ({ className }: Props): React.ReactElement<Props> | null {
  // API connectivity
  const URL = 'wss://rpc.reefscan.com/ws';
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);

  // Polkadot.js extension initialization
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>();
  const [injectedAccounts, setInjectedAccounts] = useState<InjectedAccountExt[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [accountSigner, setAccountSigner] = useState<any>(null);

  // EVM contract interaction
  const [accountId, setAccountId] = useState<string>();
  const [evmAddress, setEvmAddress] = useState('');
  const [evmProvider, setEvmProvider] = useState<Provider | null>(null);

  // Flipper contract values
  const marketAdd = '0x93De6dC7fcC2FA1aac73B34687eD1486d97fd76d'
  const nftTokenAdd = '0x915129DEfAe29D9db2E29475B22ee872824F64d9'

  const [marketItems, setMarketItems] = useState<any>();


  // DROPDOWN ACCOUNT SELECTION
  const _onChangeAccountId = useCallback(({ currentTarget: { value } }: React.SyntheticEvent<HTMLSelectElement>): void => {
    setAccountId(value);
    console.log(`Selected account: ${value}`);
  }, []);

  const buyNft =  async (e:any, data:any ) => {
    console.log("data", data)
    console.log("e", e)
    console.log(data.item_id, "itemId")
    console.log(data.nft_contract, "contract_add")
    if (!evmProvider || !accountId) return;

    const wallet = new EvmSigner(evmProvider, accountId, accountSigner);
    const marketContract = new ethers.Contract(marketAdd as string, Market.abi, wallet);
    const buyNftTxn = await marketContract.createMarketSale(data.nft_contract, data.item_id, {value: ethers.utils.parseEther(data.price)});
    console.log(buyNftTxn, "BuyTxn")
    alert("Bought Item sucessfully")
    const newItems = await fetchNFTMarketItems();
    console.log(newItems, "newItems")
    setMarketItems(newItems)

  }

  const _onChangeAccountId1 = async (e:any, {value}:any) => {
    setAccountId(value);
    console.log(`Selected account: ${value}`);
    // console.log(evmAddress)
    if (accountId && evmProvider && evmProvider.api) {
      const isReady = await evmProvider.api.isReady
      console.log("isReady")
      console.log(isReady.isReady)
      evmProvider.api.isReady.then(() => {
        evmProvider.api.query.evmAccounts.evmAddresses(value).then((result) => {
          if (result.isEmpty) {
            const wallet = new EvmSigner(evmProvider, value, accountSigner);
            wallet.isClaimed().then((isClaimed) => {
              if (isClaimed) {
                console.log("Account is claimed")
                setEvmAddress(value)
              } else {
                console.log("Account is not claimed")
                wallet.claimDefaultAccount().then((result) => {
                  console.log(`New account created NOT Claimed: ${result}`);
                }).catch((error) => {
                  console.log(`Error creating new account: ${error}`);
                  alert(`Deposit some reef into account for existensial crisis: ${error}`)
                })
              }
            })
            wallet.claimDefaultAccount().then((result) => {
              console.log(`New account created: ${result}`);
            });
            // console.log("=============")
            // console.log(newAccount.toString());
            // setEvmAddress(newAccount.toString());
          } else {
            console.log("Efefect EVMProvider:", result.toString());
            setEvmAddress(result.toString());
          }
        });
      });
    } else {
      setEvmAddress('');
    }
  }
  const fetchNFTMarketItems = async (): Promise<any> => {
    if (!evmProvider || !accountId) return;

    const wallet = new EvmSigner(evmProvider, accountId, accountSigner);
    const marketContract = new ethers.Contract(marketAdd as string, Market.abi, wallet);
    const tokenContract = new ethers.Contract(nftTokenAdd as string, NFT.abi, wallet);

  

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const marketItems = await marketContract.fetchMarketItems()

    const items = await Promise.all(marketItems.map(async (i: { tokenId: any;  nftContract: any; price: { toString: () => ethers.BigNumberish; }; itemId: { toNumber: () => any; }; seller: any; owner: any;  }) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      console.log(tokenUri)
      const meta = await axios.get(tokenUri)
      console.log(meta)
      console.log("meta")
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        nftContract: i.nftContract,
      }
      console.log("item", item)
      return item
  }))
  console.log("items", items)
  return items
}

  // FLIPPER GET(): Call Flipper get() function (view only, no funds are expended)
  const _onClickGetContractValue = useCallback(async (): Promise<void> => {
    fetchNFTMarketItems().then((result) => {
      console.log(result);
      console.log("=============AGAIN")
    }).catch((error) => {})
    // if (!evmProvider || !accountId) return;

    // const wallet = new EvmSigner(evmProvider, accountId, accountSigner);
    // const marketContract = new ethers.Contract(marketAdd as string, Market.abi, wallet);


    // // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    // const marketItems = await marketContract.fetchMarketItems()

    // console.log("marketItems");
    // console.log(marketItems);
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    // setFlipperValue(value.toString());
  }, [evmProvider, accountId, accountSigner]);

  // FLIPPER FLIP(): Call Flipper flip() function (the value will be swapped, funds are expended)
  const _onClickFlipContractValue = useCallback(async (): Promise<void> => {
    if (!evmProvider || !accountId) return;

    const wallet = new EvmSigner(evmProvider, accountId, accountSigner);
    const ercContract = new ethers.Contract(marketAdd as string, Market.abi, wallet);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
      const result = await ercContract.flip();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/restrict-template-expressions
      alert(`Value was flipped! TX: ${result.toString()}`);
      console.log('Result: ', result);
    } catch {
      alert('Value was not flipped! See console!');
    }
  }, [evmProvider, accountId, accountSigner]);

  // Obtain EVM address based on the accountId
  useEffect(() => {
    if (accountId && evmProvider && evmProvider.api) {
      evmProvider.api.isReady.then(() => {
        evmProvider.api.query.evmAccounts.evmAddresses(accountId).then((result) => {
          if (result.isEmpty) {
            setEvmAddress('');
          } else {
            console.log("Efefect EVMProvider:", result.toString());
            setEvmAddress(result.toString());
          }
        });
      });
    } else {
      setEvmAddress('');
    }
  }, [accountId, evmProvider, ]);

  useEffect((): void => {
    // Polkadot.js extension initialization as per https://polkadot.js.org/docs/extension/usage/
    const injectedPromise = web3Enable('ReeFTY Market');

    const evmProvider = new Provider({
      provider: new WsProvider(URL)
    });

    setEvmProvider(evmProvider);

    evmProvider.api.on('connected', () => setIsApiConnected(true));
    evmProvider.api.on('disconnected', () => setIsApiConnected(false));

    // Populate account dropdown with all accounts when API is ready
    evmProvider.api.on('ready', async (): Promise<void> => {
      try {
        await injectedPromise
          .then(() => web3Accounts())
          .then((accounts) =>
            accounts.map(
              ({ address, meta }, whenCreated): InjectedAccountExt => ({
                address,
                meta: {
                  ...meta,
                  name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
                  whenCreated
                }
              })
            )
          )
          .then((accounts) => {
            setInjectedAccounts(accounts);
            setAccountId(accounts[0].address);
            console.log('Accounts:address ', accounts[0].address);
            
          })
          .catch((error): InjectedAccountExt[] => {
            console.error('web3Enable', error);

            return [];
          });
      } catch (error) {
        console.error('Unable to load chain', error);
      }
    });

    // Setup Polkadot.js signer
    injectedPromise
      .then((extensions) => {
        setExtensions(extensions);
        setAccountSigner(extensions[0]?.signer);
        console.log('Extensions: ', extensions[0].signer);
      })
      .catch((error) => console.error(error));

    setIsApiInitialized(true);
  }, []);

  // ------- SUBSTRATE ACCOUNT GENERATION -------
  const [address, setAddress] = useState<string | null>(null);
  const [phrase, setPhrase] = useState<string | null>(null);
  const SS58_FORMAT = 42;

  const _onClickNew = useCallback((): void => {
    const phrase = mnemonicGenerate(12);
    const { address } = keyring.createFromUri(phrase);

    setAddress(keyring.encodeAddress(address, SS58_FORMAT));
    setPhrase(phrase);
  }, []);

  useEffect((): void => {
    _onClickNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    fetchNFTMarketItems().then((result) => {
      console.log(result);
      console.log("=============USEEFFECT")
      setMarketItems(result);
    }).catch((error) => {})
  }, [marketAdd, accountId, accountSigner]);

  useEffect((): void => {
    address && setAddress(keyring.encodeAddress(address, SS58_FORMAT));
  }, [address]);

  if (!address || !phrase) {
    return null;
  }
  const acMap = injectedAccounts.map(({address, meta: {name}}) => ({
    key:address, value:address, text:name
    // key:address, value:address, text:name+' - '+address
  }) );


  return (
    <div className={className}>
      <Segment color='black' className='no-border-radius' raised inverted>
      <HeaderMain acmap={acMap} avalue={accountId} handleChanges={_onChangeAccountId1}></HeaderMain>
      {/* <h1>EVM contract interaction</h1> */}
      <section>
        <Dropdown placeholder='Select Account' className='drop-head' onChange={_onChangeAccountId1} options={acMap} value={accountId} />
      </section>
      </Segment>
      
      <section>
      <div >
      <Segment.Group horizontal raised className='account-info' >
        <Segment textAlign='center'>Account: {accountId}</Segment>
        <Segment textAlign='center'>
        {!evmAddress && isApiInitialized
          ? <p>No EVM address is bound to this address. The requests will fail.</p>
          : <p>EVM address: {evmAddress}</p>}
        </Segment>
        <Segment textAlign='center'>
        NFT Contact deployed at address :  {nftTokenAdd}
        </Segment>
        </Segment.Group>
        </div>
      </section>
      <section>
      </section>
      { !marketItems ? (
        <div>No Items listed for Sale : come back later</div>
      ) : (
        <div>
          <Container>
          <Header as='h2' textAlign='center'>NFTs Listed for Sale</Header>
          <CardColored items={marketItems} buyNft={buyNft}>

          </CardColored>
          </Container>
          {/* {marketItems.toString()} */}
        </div>
      )}
    </div>
  );
}

cryptoWaitReady()
  .then((): void => {
    keyring.loadAll({ ss58Format: 42, type: 'sr25519' });
    ReactDOM.render(
      <App />,
      document.getElementById('root')
    );
  })
  .catch(console.error);
