import { SubstrateProvider } from './SubstrateContext';
import BlockNumber from './BlockNumber';
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
          <a href="https://github.com/shawntabrizi/blobby">GitHub</a>)
        </p>
      </Hero>
      <AccountProvider appName="blobby">
        <Row>
          <SubstrateProvider providerUrl="wss://kusama-rpc.polkadot.io">
            <Col lg={6}>
              <Card title="Kusama (ID: 0)">
                <BlockNumber />
                <AccountBalance />
                <XcmTransferRelayToPara parachainId={3338} />
              </Card>
            </Col>
          </SubstrateProvider>
          <SubstrateProvider providerUrl="wss://blob-kusama-rpc-bootnode-1.thrum.dev">
            <Col lg={6}>
              <Card title="Blob (ID: 3338)">
                <BlockNumber />
                <AccountBalance />
                <XcmTransferParaToRelay parachainId={3338} />
              </Card>
            </Col>
            <Col lg={12}>
              <Card title="Upload Blob">
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
