import React, { useState } from 'react';
import { useSubstrate } from './SubstrateContext';
import { useAccount } from './AccountContext';
import { web3FromAddress } from '@polkadot/extension-dapp';

const XcmTransfer = ({ destinationChainId }) => {
  const { api } = useSubstrate();
  const { selectedAccount } = useAccount();
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    try {
      if (api && selectedAccount) {
        const { address } = selectedAccount;

        const destination = api.createType('XcmVersionedMultiLocation', {
          V2: {
            parents: '0',
            interior: {
              X2: [{ Parachain: destinationChainId }],
            },
          },
        });

        let accountId = api.createType('AccountId', address);

        const beneficiary = api.createType('XcmVersionedMultiLocation', {
          V2: {
            parents: '0',
            interior: {
              X1: {
                AccountId32: {
                  network: 'Any',
                  id: accountId.toHex(),
                },
              },
            },
          },
        });

        const assets = api.createType('XcmVersionedMultiAssets', {
          V2: [
            {
              id: {
                Concrete: {
                  parents: 0,
                  interior: {
                    Here: '',
                  },
                },
              },
              fun: {
                Fungible: '100000000000',
              },
            },
          ],
        });

        const fee_asset_item = '0';

        const weight_limit = 'Unlimited';

        const call = api.tx.xcmPallet.limitedReserveTransferAssets(
          destination,
          beneficiary,
          assets,
          fee_asset_item,
          weight_limit
        );

        const injector = await web3FromAddress(address);

        const unsubscribe = await call.signAndSend(
          address,
          { signer: injector.signer },
          ({ status }) => {
            setStatus(`Current status is ${status}`);

            if (status.isInBlock) {
              setStatus(
                `Transaction included at blockHash ${status.asInBlock}`
              );
            } else if (status.isFinalized) {
              setStatus(
                `Transaction finalized at blockHash ${status.asFinalized}`
              );
              unsubscribe();
            }
          }
        );
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h5>XCM Reserve Transfer to {destinationChainId}</h5>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </label>
      <button onClick={handleSubmit}>Submit XCM Transfer</button>
      {status && <p>Status: {status}</p>}
    </div>
  );
};

export default XcmTransfer;
