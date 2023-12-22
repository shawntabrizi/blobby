// AccountBalance.js
import React, { useEffect, useState } from 'react';
import { useSubstrate } from './SubstrateContext';
import { useAccount } from './AccountContext';

const AccountBalance = () => {
  const { api } = useSubstrate();
  const { selectedAccount } = useAccount();
  const [balance, setBalance] = useState(null);
  const [tokenInfo] = useState({ name: 'KSM', decimals: 12 });

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        if (api) {
          //   const chainInfo = await api.registry.getChainProperties();
          //   setTokenInfo({
          //     name: chainInfo.tokenSymbol.toString(),
          //     decimals: chainInfo.tokenDecimals,
          //   });
        }
      } catch (error) {
        console.error('Error fetching token information:', error);
      }
    };

    const fetchBalance = async () => {
      try {
        if (api && selectedAccount) {
          const { address } = selectedAccount;
          const {
            data: { free: accountBalance },
          } = await api.query.system.account(address);
          setBalance(accountBalance.toString());
        }
      } catch (error) {
        console.error('Error fetching account balance:', error);
      }
    };

    fetchTokenInfo();
    fetchBalance();
  }, [api, selectedAccount]);

  // Format the balance with correct decimal places
  const formattedBalance =
    balance !== null
      ? (parseFloat(balance) / 10 ** tokenInfo.decimals).toFixed(4)
      : 'Loading...';

  return (
    <div>
      <h2>Account Balance</h2>
      {selectedAccount ? (
        <p>
          <strong>Address:</strong> {selectedAccount.address}
          <br />
          <strong>Balance:</strong> {formattedBalance} {tokenInfo.name}
        </p>
      ) : (
        <p>No account selected.</p>
      )}
    </div>
  );
};

export default AccountBalance;
