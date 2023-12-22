import React, { useState } from 'react';
import { useSubstrate } from './SubstrateContext';
import { useAccount } from './AccountContext';
import { AssetTransferApi } from '@substrate/asset-transfer-api';
import { web3FromAddress } from '@polkadot/extension-dapp';

const XcmTransfer = ({ destinationChainId }) => {
  const { api, specName, safeXcmVersion } = useSubstrate();
  const { selectedAccount } = useAccount();
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    try {
      if (api && selectedAccount) {
        const { address } = selectedAccount;

        const assetsApi = new AssetTransferApi(api, specName, safeXcmVersion);

        console.log(specName, safeXcmVersion);

        const call = await assetsApi.createTransferTransaction(
          '3338',
          address, // destAddress
          ['KSM'],
          ['1000000000000'],
          {
            format: 'call',
            isLimited: true,
            xcmVersion: 2,
          }
        );

        console.log(call);

        // const unsubscribe = await call.signAndSend(
        //   address,
        //   { signer: injector.signer },
        //   ({ status }) => {
        //     setStatus(`Current status is ${status}`);

        //     if (status.isInBlock) {
        //       setStatus(
        //         `Transaction included at blockHash ${status.asInBlock}`
        //       );
        //     } else if (status.isFinalized) {
        //       setStatus(
        //         `Transaction finalized at blockHash ${status.asFinalized}`
        //       );
        //       unsubscribe();
        //     }
        //   }
        // );
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
