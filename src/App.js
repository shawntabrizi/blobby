import { SubstrateProvider } from './SubstrateContext';
import BlockNumberComponent from './BlockNumber';
import { AccountProvider } from './AccountContext';
import TransactionButton from './TransactionButton';
import AccountBalance from './AccountBalance';
import { Container, Row, Col } from 'react-bootstrap';
import Card from './ui/Card';
import BlobUpload from './BlobUpload';
import XcmTransfer from './XcmTransfer';

function App() {
  return (
    <Container>
      <AccountProvider>
        <Row>
          <Col>
            <SubstrateProvider providerUrl="wss://kusama-rpc.polkadot.io">
              <Card title="Kusama (ID: 0)">
                <BlockNumberComponent />
                <AccountBalance />
                <TransactionButton />

                <XcmTransfer destinationChainId={3338} />
                {/* Other components that need access to the Substrate API */}
              </Card>
            </SubstrateProvider>
          </Col>
          <SubstrateProvider providerUrl="wss://blob-kusama-rpc-bootnode-1.thrum.dev">
            <Col>
              <Card title="Blob (ID: 3338)">
                <BlockNumberComponent />
                <AccountBalance />
                <TransactionButton />
                {/* Other components that need access to the Substrate API */}
              </Card>
            </Col>
            <Row>
              <Card title="Upload">
                <BlobUpload />
              </Card>
            </Row>
          </SubstrateProvider>
        </Row>
      </AccountProvider>
    </Container>
  );
}

export default App;
