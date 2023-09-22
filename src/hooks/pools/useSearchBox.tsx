import { ChangeEvent, useState } from 'react';

const useSearchBox = () => {
  const [searchFilterValue, setSearchFilterValue] = useState('');
  const handleSearchFilterChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchFilterValue(event.target.value);
  };
  return { searchFilterValue, setSearchFilterValue, handleSearchFilterChange };
};

export default useSearchBox;
