import React, { useEffect, useState } from 'react';
import { useSubstrate } from './SubstrateContext';

const BlockNumberComponent = () => {
  const { api } = useSubstrate();
  const [blockNumber, setBlockNumber] = useState(null);

  useEffect(() => {
    // Fetch the latest block number and subscribe to new blocks
    const fetchAndSubscribe = async () => {
      try {
        if (api) {
          // Fetch initial block number
          const blockHeader = await api.rpc.chain.getHeader();
          setBlockNumber(blockHeader.number.toNumber());

          // Subscribe to new blocks
          api.rpc.chain.subscribeNewHeads((header) => {
            setBlockNumber(header.number.toNumber());
          });
        }
      } catch (error) {
        console.error('Error fetching and subscribing to block number:', error);
      }
    };

    fetchAndSubscribe();
  }, [api]);

  return (
    <div>
      {blockNumber !== null ? (
        <p>Latest Block Number: {blockNumber}</p>
      ) : (
        <p>Fetching block number...</p>
      )}
    </div>
  );
};

export default BlockNumberComponent;
