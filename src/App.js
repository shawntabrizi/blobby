import { SubstrateProvider } from './SubstrateContext';
import BlockNumberComponent from './BlockNumber';
import { AccountProvider } from './AccountContext';
import AccountBalance from './AccountBalance';
import { Container, Row, Col } from 'react-bootstrap';
import Card from './ui/Card';
import BlobUpload from './BlobUpload';
import XcmTransferRelayToPara from './XcmTransferRelayToPara';
import XcmTransferParaToRelay from './XcmTransferParaToRelay';
import Hero from './ui/Hero';

function App() {
  return (
    <Container>
      <Hero>
        <h2>blobby</h2>
        <p>
          your friendly neighborhood blob ui (
          <a href="https://github.com/shawntabrizi/blobby">Github</a>)
        </p>
      </Hero>
      <AccountProvider>
        <Row>
          <SubstrateProvider providerUrl="wss://kusama-rpc.polkadot.io">
            <Col lg={6}>
              <Card title="Kusama (ID: 0)">
                <BlockNumberComponent />
                <AccountBalance />
                <XcmTransferRelayToPara parachainId={3338} />
                {/* Other components that need access to Kusama */}
              </Card>
            </Col>
          </SubstrateProvider>
          <SubstrateProvider providerUrl="wss://blob-kusama-rpc-bootnode-1.thrum.dev">
            <Col lg={6}>
              <Card title="Blob (ID: 3338)">
                <BlockNumberComponent />
                <AccountBalance />
                <XcmTransferParaToRelay parachainId={3338} />
                {/* Other components that need access to Blobs */}
              </Card>
            </Col>
            <Col lg={12}>
              <Card title="Upload">
                <BlobUpload />
              </Card>
            </Col>
          </SubstrateProvider>
        </Row>
      </AccountProvider>
    </Container>
  );
}

export default App;
