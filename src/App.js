import { SubstrateProvider } from './SubstrateContext';
import BlockNumberComponent from './BlockNumber';
import { AccountProvider } from './AccountContext';
import AccountBalance from './AccountBalance';
import { Container, Row, Col } from 'react-bootstrap';
import Card from './ui/Card';
import BlobUpload from './BlobUpload';
import XcmTransferRelayToPara from './XcmTransferRelayToPara';
import XcmTransferParaToRelay from './XcmTransferParaToRelay';

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
                <XcmTransferRelayToPara parachainId={3338} />
                {/* Other components that need access to Kusama */}
              </Card>
            </SubstrateProvider>
          </Col>
          <SubstrateProvider providerUrl="wss://blob-kusama-rpc-bootnode-1.thrum.dev">
            <Col>
              <Card title="Blob (ID: 3338)">
                <BlockNumberComponent />
                <AccountBalance />
                <XcmTransferParaToRelay parachainId={3338} />
                {/* Other components that need access to Blobs */}
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
