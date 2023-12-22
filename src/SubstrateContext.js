import React, { createContext, useContext, useState, useEffect } from 'react';
import { constructApiPromise } from '@substrate/asset-transfer-api';

const SubstrateContext = createContext();

const SubstrateProvider = ({ children, providerUrl }) => {
  const [api, setApi] = useState(null);
  const [specName, setSpecName] = useState(null);
  const [safeXcmVersion, setSafeXcmVersion] = useState(null);

  useEffect(() => {
    const connectToSubstrate = async () => {
      try {
        const { api, specName, safeXcmVersion } = await constructApiPromise(
          providerUrl
        );
        setApi(api);
        setSpecName(specName);
        setSafeXcmVersion(safeXcmVersion);
      } catch (error) {
        console.error('Error connecting to Substrate:', error);
      }
    };

    connectToSubstrate();
  }, [providerUrl]);

  const contextValue = {
    api,
    specName,
    safeXcmVersion,
  };

  return (
    <SubstrateContext.Provider value={contextValue}>
      {children}
    </SubstrateContext.Provider>
  );
};

const useSubstrate = () => {
  const context = useContext(SubstrateContext);
  if (!context) {
    throw new Error('useSubstrate must be used within a SubstrateProvider');
  }
  return context;
};

export { SubstrateProvider, useSubstrate };
