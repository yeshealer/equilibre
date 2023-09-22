import { Pair, Vote } from '@/interfaces';
import { ChangeEvent, useEffect, useState } from 'react';

const useVoteFilters = (data: Vote[]) => {
  const [activeFilters, setActiveFilters] = useState([] as string[]);
  const [filteredData, setFilteredData] = useState(data);
  const [totalVotes, setTotalVotes] = useState(0);

  const [minRewards, setMinRewards] = useState('0');
  const [maxRewards, setMaxRewards] = useState('');

  useEffect(() => {
    setFilteredData(data);
    if (filteredData.length === 0) {
      forceUpdate();
    }
    const pairsWithGauge = data.filter(vote => vote.pair.gauge);
    const totalVotes = pairsWithGauge.reduce(
      (acc, vote) => acc + vote.pair.gauge?.votes!,
      0
    );
    setTotalVotes(totalVotes);
    setActiveFilters(['bribed']);
    let auxData = data;
    auxData = auxData.filter(vote =>
      vote.pair.gauge?.bribes?.find(
        bribe =>
          bribe.rewardAmount > 0 &&
          (bribe.token.price as number) * bribe.rewardAmount >= 1
      )
    );
    setFilteredData(auxData);
  }, [data]);

  const forceUpdate = () => {
    setFilteredData(data);
  };
  useEffect(() => {
    const auxMinRewards = minRewards != '' ? minRewards : '0';
    const auxMaxRewards = maxRewards != '' ? maxRewards : '';

    if (auxMinRewards >= '0' && auxMaxRewards !== '') {
      const auxData = data.filter(
        vote =>
          (Number(vote.pair.gauge?.tbv!) / vote.pair.gauge?.votes!) * 1000 >
            Number(auxMinRewards) &&
          (Number(vote.pair.gauge?.tbv!) / vote.pair.gauge?.votes!) * 1000 <
            Number(auxMaxRewards)
      );
      setFilteredData(auxData);
    } else if (auxMinRewards >= '0' && auxMaxRewards === '') {
      const auxData = data.filter(vote => {
        return (
          (Number(vote.pair.gauge?.tbv!) / vote.pair.gauge?.votes!) * 1000 >
          Number(auxMinRewards)
        );
      });
      setFilteredData(auxData);
    }
  }, [minRewards, maxRewards]);
  const handleOnChangeSwitch = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      setActiveFilters([...activeFilters, event.target.name]);
      let auxData = filteredData;

      if (event.target.name === 'bribed') {
        auxData = auxData.filter(vote =>
          vote.pair.gauge?.bribes?.find(
            bribe =>
              bribe.rewardAmount > 0 &&
              (bribe.token.price as number) * bribe.rewardAmount >= 1
          )
        );
      }

      setFilteredData(auxData);
    } else {
      setActiveFilters(
        activeFilters.filter(filter => filter !== event.target.name)
      );
      let auxData = data;

      setFilteredData(auxData);
    }
  };

  return {
    activeFilters,
    filteredData,
    handleOnChangeSwitch,
    minRewards,
    maxRewards,
    setMinRewards,
    setMaxRewards,
  };
};

export default useVoteFilters;
