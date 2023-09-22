import { Pair } from '@/interfaces';
import { ChangeEvent, useEffect, useState } from 'react';

const useLiquidityFilters = (data: Pair[]) => {
  const [activeFilters, setActiveFilters] = useState([] as string[]);
  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    setFilteredData(data);
    if (filteredData.length === 0) {
      forceUpdate();
    }
  }, [data]);

  const forceUpdate = () => {
    setFilteredData(data);
  };

  const handleOnChangeSwitch = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      setActiveFilters([...activeFilters, event.target.name]);
      let auxData = filteredData;

      if (event.target.name === 'stable') {
        auxData = auxData.filter(pair => pair.stable);
      } else if (event.target.name === 'volatile') {
        auxData = auxData.filter(pair => !pair.stable);
      } else if (event.target.name === 'gauge') {
        auxData = auxData.filter(pair => pair.gauge);
      } else if (event.target.name === 'deposit') {
        auxData = auxData.filter(pair => (pair?.balanceStaked as number) > 0);
      }

      setFilteredData(auxData);
    } else {
      setActiveFilters(
        activeFilters.filter(filter => filter !== event.target.name)
      );
      let auxData = data;
      activeFilters.forEach(activeFilter => {
        if (activeFilter !== event.target.name) {
          if (activeFilter === 'stable') {
            auxData = auxData.filter(pair => pair.stable);
          } else if (activeFilter === 'volatile') {
            auxData = auxData.filter(pair => !pair.stable);
          } else if (activeFilter === 'gauge') {
            auxData = auxData.filter(pair => pair.gauge);
          } else if (activeFilter === 'deposit') {
            auxData = auxData.filter(
              pair => (pair.balanceStaked as number) > 0
            );
          }
        }
      });
      setFilteredData(auxData);
    }
  };

  return { activeFilters, filteredData, handleOnChangeSwitch };
};

export default useLiquidityFilters;
