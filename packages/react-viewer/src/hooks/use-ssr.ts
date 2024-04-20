import { useEffect, useState } from 'react';
import { isBrowser } from '@n3bula/utils';

export function useSSR() {
  const [browser, setBrowser] = useState<boolean>(false);

  useEffect(() => {
    setBrowser(isBrowser());
  }, []);

  return { isBrowser: browser, isServer: !browser };
}