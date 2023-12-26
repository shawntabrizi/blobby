import React, { useState } from 'react';
import { useSubstrate } from './SubstrateContext';
import { useAccount } from './AccountContext';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { Button, Form, InputGroup } from 'react-bootstrap';

const BlobUpload = () => {
  const { api } = useSubstrate();
  const { selectedAccount } = useAccount();
  const [blob, setBlob] = useState(null);
  const [namespace, setNamespace] = useState('0');
  const [status, setStatus] = useState('');

  const arrayBufferToString = (buffer) => {
    const bytes = new Uint8Array(buffer);
    return String.fromCharCode.apply(null, bytes);
  };

  // TODO: My guess is that we want to use a hex representation of a byte array.
  // const arrayBufferToHex = (buffer) => {
  //   const bytes = new Uint8Array(buffer);
  //   return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
  //     ''
  //   );
  // };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setBlob(arrayBufferToString(content));
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    try {
      if (api && selectedAccount && blob) {
        const { address } = selectedAccount;

        // TODO: real submit blob does not currently work. just uncomment when ready
        // const call = await api.tx.blobs.submitBlob(namespace, blob);

        console.log('remark', JSON.stringify({ namespace, blob }));

        const call = await api.tx.system.remarkWithEvent(
          JSON.stringify({ namespace, blob })
        );

        const injector = await web3FromAddress(address);

        const unsubscribe = await call.signAndSend(
          address,
          { signer: injector.signer },
          ({ status }) => {
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
          }
        );
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      {selectedAccount ? (
        <>
          <h5>Select Namespace</h5>
          <InputGroup>
            <InputGroup.Text>Namespace</InputGroup.Text>
            <Form.Control
              type="number"
              min="0"
              value={namespace}
              onChange={(e) => setNamespace(Number(e.target.value))}
            />
          </InputGroup>
          <br />
          <h5>Select Blob</h5>
          <InputGroup>
            <Form.Control type="file" onChange={handleFileChange} />
            <Button onClick={handleSubmit} disabled={!blob}>
              Submit Blob
            </Button>
          </InputGroup>
        </>
      ) : (
        <p>No account selected.</p>
      )}
      {status && <p>Status: {status}</p>}
    </div>
  );
};

export default BlobUpload;
