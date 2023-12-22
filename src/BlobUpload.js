import React, { useState } from 'react';
import { useSubstrate } from './SubstrateContext';
import { useAccount } from './AccountContext';

const BlobUpload = () => {
  const { api } = useSubstrate();
  const { selectedAccount } = useAccount();
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    try {
      if (api && selectedAccount && fileContent) {
        const { address } = selectedAccount;

        const txHash = await api.tx.system
          .remark(fileContent)
          .signAndSend(address);

        console.log('Transaction Hash:', txHash);
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  return (
    <div>
      <h2>File Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={!fileContent}>
        Submit File
      </button>
    </div>
  );
};

export default BlobUpload;
