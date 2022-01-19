import React, { useCallback, ChangeEventHandler } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import { useNetworkLsValue } from 'hooks/useNetworkLsValue';

export const NetworkSelect = () => {
  const [network, setNetwork] = useNetworkLsValue();
  const enumEntries = Object.entries(WalletAdapterNetwork);

  const handleSelectChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      setNetwork(e.target.value as WalletAdapterNetwork);
    },
    [setNetwork],
  );

  return (
    <select
      onChange={handleSelectChange}
      className="
        form-select
        block
        font-normal
        border-1 border-gray-300 dark:border-gray-800
        focus:ring-amber-400 focus:border-amber-400 hover:border-amber-400 dark:hover:border-amber-400
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100 hover:text-amber-400 dark:hover:text-amber-400
        text-sm
        transition
        rounded-md
      "
    >
      {enumEntries.map(([label, value]) => {
        return (
          <option key={value} value={value} selected={network === value}>
            {label}
          </option>
        );
      })}
    </select>
  );
};
