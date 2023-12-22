import './App.css';
import { SubstrateProvider } from './SubstrateContext';
import BlockNumberComponent from './BlockNumber';

function App() {
  return (
    <div className="App">
      <SubstrateProvider providerUrl="wss://rpc.polkadot.io">
        <div>
          <h1>Your App</h1>
          <BlockNumberComponent />
          {/* Other components that need access to the Substrate API */}
        </div>
      </SubstrateProvider>

      <SubstrateProvider providerUrl="wss://kusama-rpc.polkadot.io">
        <div>
          <h1>Your App</h1>
          <BlockNumberComponent />
          {/* Other components that need access to the Substrate API */}
        </div>
      </SubstrateProvider>
    </div>
  );
}

export default App;
