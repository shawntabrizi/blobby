import React, { useState } from 'react';
import { useSubstrate } from './SubstrateContext';
import { useAccount } from './AccountContext';
import { web3FromAddress } from '@polkadot/extension-dapp';

const XcmTransferParaToRelay = ({ parachainId }) => {
  const { api } = useSubstrate();
  const { selectedAccount } = useAccount();
  // Default is .1 KSM = 10^11
  const [amount, setAmount] = useState(100000000000);
  const [status, setStatus] = useState('');
  const [tokenInfo] = useState({ name: 'KSM', decimals: 12 });

  // TODO: The code below is not correct for Para to Relay.
  // It is copy paste from Relay to Para.
  // Thus we disabled the functionality of this component.
  const disabled = true;

  const handleSubmit = async () => {
    try {
      if (api && selectedAccount) {
        const { address } = selectedAccount;

        const destination = api.createType('XcmVersionedMultiLocation', {
          V2: {
            parents: '0',
            interior: {
              X1: { Parachain: parachainId },
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
                Fungible: amount,
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

  // Format the balance with correct decimal places
  const formattedAmount =
    amount !== null
      ? (parseFloat(amount) / 10 ** tokenInfo.decimals).toFixed(4)
      : 'Loading...';

  return (
    <div>
      <h5>XCM Reserve Transfer from {parachainId} to Relay</h5>
      {!disabled ? (
        <>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </label>
          <button onClick={handleSubmit}>Send to Relay</button>
          {formattedAmount && (
            <p>
              (Sending {formattedAmount}
              {tokenInfo.name})
            </p>
          )}
          {status && <p>Status: {status}</p>}
        </>
      ) : (
        <p>Transfers back to the relay chain are disabled at the moment.</p>
      )}
    </div>
  );
};

export default XcmTransferParaToRelay;
