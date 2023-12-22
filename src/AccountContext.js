import React, { createContext, useContext, useState, useEffect } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const AccountContext = createContext();

const AccountProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        await web3Enable('my cool dapp');
        const injectedAccounts = await web3Accounts();
        setAccounts(injectedAccounts);
        if (injectedAccounts.length > 0 && !selectedAccount) {
          // Set the first account as the selected account initially
          setSelectedAccount(injectedAccounts[0]);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, [selectedAccount]);

  const setAccount = (account) => {
    setSelectedAccount(account);
  };

  const handleAccountChange = (event) => {
    const selectedAddress = event.target.value;
    const selected = accounts.find(
      (account) => account.address === selectedAddress
    );
    setAccount(selected);
  };

  return (
    <AccountContext.Provider value={{ selectedAccount, setAccount }}>
      <div>
        <h2>Account Information</h2>
        {accounts.length > 0 ? (
          <div>
            <label>
              Select Account:
              <select
                value={selectedAccount ? selectedAccount.address : ''}
                onChange={handleAccountChange}
              >
                {accounts.map((account) => (
                  <option key={account.address} value={account.address}>
                    {account.meta.name} - {account.address}
                  </option>
                ))}
              </select>
            </label>
            <p>
              <strong>Selected Account:</strong>{' '}
              {selectedAccount ? selectedAccount.address : 'None'}
            </p>
          </div>
        ) : (
          <p>
            No accounts found. Make sure the Polkadot extension is installed and
            unlocked.
          </p>
        )}
      </div>
      {children}
    </AccountContext.Provider>
  );
};

const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

export { AccountProvider, useAccount };
