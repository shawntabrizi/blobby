import React, { useState } from 'react';
import { useSubstrate } from './SubstrateContext';
import { useAccount } from './AccountContext';
import { web3FromAddress } from '@polkadot/extension-dapp';

const TransactionButton = () => {
  const { api } = useSubstrate();
  const { selectedAccount } = useAccount();
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    try {
      if (api && selectedAccount) {
        const { address } = selectedAccount;

        // Use the injected account for signing
        const injector = await web3FromAddress(address);

        const unsubscribe = await api.tx.system
          .remark('hello from shawn')
          .signAndSend(address, { signer: injector.signer }, ({ status }) => {
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
          });
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit Transaction</button>
      {status && <p>Status: {status}</p>}
    </div>
  );
};

export default TransactionButton;
