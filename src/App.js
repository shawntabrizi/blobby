import './App.css';
import { SubstrateProvider } from './SubstrateContext';
import BlockNumberComponent from './BlockNumber';
import { AccountProvider } from './AccountContext';
import TransactionButton from './TransactionButton';
import AccountBalance from './AccountBalance';

function App() {
  return (
    <div className="App">
      <AccountProvider>
        <SubstrateProvider providerUrl="wss://rpc.polkadot.io">
          <div>
            <h1>Polkadot</h1>
            <BlockNumberComponent />
            <AccountBalance />
            <TransactionButton />
            {/* Other components that need access to the Substrate API */}
          </div>
        </SubstrateProvider>

        <SubstrateProvider providerUrl="wss://kusama-rpc.polkadot.io">
          <div>
            <h1>Kusama</h1>
            <BlockNumberComponent />
            <AccountBalance />
            <TransactionButton />
            {/* Other components that need access to the Substrate API */}
          </div>
        </SubstrateProvider>
      </AccountProvider>
    </div>
  );
}

export default App;
