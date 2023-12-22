import React, { createContext, useContext, useState, useEffect } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import Card from './ui/Card';
import { Dropdown } from 'react-bootstrap';

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

  const handleAccountChange = (account) => {
    setAccount(account);
  };

  return (
    <AccountContext.Provider value={{ selectedAccount, setAccount }}>
      <Card title="Account Selector">
        <div>
          {accounts.length > 0 ? (
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="primary">
                  {selectedAccount
                    ? `${selectedAccount.meta.name} - ${selectedAccount.address}`
                    : 'Select Account'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {accounts.map((account) => (
                    <Dropdown.Item
                      key={account.address}
                      onClick={() => handleAccountChange(account)}
                    >
                      {account.meta.name} - {account.address}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <p>
              No accounts found. Make sure the Polkadot extension is installed
              and unlocked.
            </p>
          )}
        </div>
      </Card>
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
