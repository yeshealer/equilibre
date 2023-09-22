import CustomTable from '@/components/core/CustomTable';
import { useSearchBox } from '@/hooks/pools';
import useLiquidityFilters from '@/hooks/pools/useLiquidityFilters';
import { HStack, Spinner } from '@chakra-ui/react';
import poolsDefinition from '../../tableDefinitions/PoolsDefinition';
import SearchBox from '../SearchBox';
import LiquidityFilters from './LiquidityFilters';
import { useEffect, useState } from 'react';

const LiquidityBody = () => {
  const { searchFilterValue, setSearchFilterValue, handleSearchFilterChange } =
    useSearchBox();
  const { columns, data, sortingDefault } = poolsDefinition();
  const { filteredData, handleOnChangeSwitch } = useLiquidityFilters(data);
  const [tableReady, setTableReady] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setTableReady(true);
    }, 3000);
  }, []);
  return (
    <>
      <HStack spacing={4} w={'-webkit-fill-available'}>
        <SearchBox
          searchFilterValue={searchFilterValue}
          handleSearchFilterChange={handleSearchFilterChange}
        />
        <LiquidityFilters handleOnChangeSwitch={handleOnChangeSwitch} />
      </HStack>
      {tableReady ? (
        <CustomTable
          columns={columns}
          data={filteredData}
          globalFilter={searchFilterValue}
          onChangeGlobalFilter={setSearchFilterValue}
          sortingDefault={sortingDefault}
        />
      ) : (
        <Spinner alignSelf={'center'} />
      )}
    </>
  );
};

export default LiquidityBody;
