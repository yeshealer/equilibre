import { Pair } from '@/interfaces';
import { usePairStore } from '@/store/pairsStore';
import { useEffect, useState } from 'react';

//* Applies search functionality to the token lists
//* Returns: filteredTokens<Token[]> and setSearch

const useSearchPair = () => {
  const { pairs } = usePairStore(state => state);
  const [filteredPairs, setFilteredPairs] = useState<Pair[]>();
  const [search, setSearch] = useState('');
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const filterAction = () => {
    let ft = pairs.filter(pair => {
      if (search && search !== '') {
        return (
          pair.address.toLowerCase().includes(search.toLowerCase()) ||
          pair.symbol.toLowerCase().includes(search.toLowerCase())
          // ||pair.name.toLowerCase().includes(search.toLowerCase())
        );
      } else {
        return pair;
      }
    });
    ft = ft
      .sort((a, b) => Number(b.balanceStaked) - Number(a.balanceStaked))
      .map(pair => {
        pair.balanceStaked = pair.balanceStaked;

        return pair;
      });
    setFilteredPairs(ft);
  };
  const startFiltering = () => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      filterAction();
    }, 500);
    setTimer(newTimer);
  };
  useEffect(() => {
    startFiltering();
  }, [search]);
  return { filteredPairs, search, setSearch };
};

export default useSearchPair;
