import { Token } from '@/interfaces';
import { useBaseAssetStore } from '@/store/baseAssetsStore';
import { useLocalAssetStore } from '@/store/localAssetsStore';
import { useState, useEffect } from 'react';

//* Applies search functionality to the token lists
//* Returns: filteredTokens<Token[]> and setSearch

const useSearchToken = (isForLocalAssets: boolean = false) => {
  const { baseAssets: tempBaseAssets } = useBaseAssetStore(state => state);
  const { localAssets } = useLocalAssetStore(state => state);
  const baseAssets = isForLocalAssets ? localAssets : tempBaseAssets;

  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let ft = getFilteredTokens(search);
    setFilteredTokens(ft);
  }, [search]);
  const getFilteredTokens = (searchStr: string) => {
    let ft = baseAssets.filter(token => {
      if (searchStr && searchStr !== '') {
        return (
          token.address.toLowerCase().includes(searchStr.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchStr.toLowerCase()) ||
          token.name.toLowerCase().includes(searchStr.toLowerCase())
        );
      } else {
        return token;
      }
    });
    ft = ft
      .sort((a, b) => Number(b.balance) - Number(a.balance))
      .map(token => {
        token.balance = token.balance;
        return token;
      });
    return ft;

  }
  return { filteredTokens, search, getFilteredTokens, setSearch };
};

export default useSearchToken;
