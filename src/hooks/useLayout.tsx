import { useAccount } from 'wagmi';
import {
  useBreakpointValue
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useGlobalStateStore } from '@/store/globalStore';
import { shallow } from 'zustand/shallow';
import { useVaraTokenStore } from '@/store/varaTokenStore';
import useIsMounted from '@/hooks/useIsMounted';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { usePairStore } from '@/store/pairsStore';
import useSimpleVeNFTs from '@/hooks/dashboard/useSimpleVeNFTs';
import { usebVaraTokenStore } from '@/store/bVaraTokenStore';
import { useVeBVaraStore } from '@/store/veBVaraStore';

const useLayout = () => {
  const { address, isConnected } = useAccount();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const mounted = useIsMounted();

  const { initBaseAssets, isLoading } = useBaseAssetStore(
    state => ({
      initBaseAssets: state.actions.initBaseAssets,
      isLoading: state.isLoading,
    }),
    shallow
  );
  const { initPairs, pairs } = usePairStore(state => ({
    initPairs: state.actions.initPairs,
    pairs: state.pairs
  }));
  const { initGlobalData } = useGlobalStateStore(state => ({
    initGlobalData: state.actions.initGlobalData,
  }));
  const { fetBalanceAndAllowance } = useVaraTokenStore(state => ({
    fetBalanceAndAllowance: state.actions.fetBalanceAndAllowance,
  }));
  const { fetAllData } = usebVaraTokenStore(state => ({
    fetAllData: state.actions.fetAllData,
  }));
  const fetVeVaras = useVeBVaraStore(state => state.actions.fetVeVaras);
  const { getSimpleVeNfts } = useSimpleVeNFTs();

  useEffect(() => {
    initBaseAssets();
    initPairs();
    initGlobalData();
  }, []);

  useEffect(() => {
    if (isConnected && pairs.length > 0) {
      getSimpleVeNfts();
    }
  }, [address, pairs.length]);

  useEffect(() => {
    fetBalanceAndAllowance(address);
    fetAllData(address);
    fetVeVaras(address);
  }, [address, isConnected]);

  return { isDesktop, mounted, isLoading };
};

export default useLayout;
