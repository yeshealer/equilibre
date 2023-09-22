import CustomTable from '@/components/core/CustomTable';
import { useSearchBox, useVoteFilters } from '@/hooks/pools';
import { HStack, Spinner } from '@chakra-ui/react';
import votesDefinition from '../../tableDefinitions/VotesDefinition';
import SearchBox from '../SearchBox';
import VoteFilters from './VoteFilters';
import CastVotes from './CastVotes';
import { useEffect, useState } from 'react';

const VoteBody = () => {
  const { searchFilterValue, setSearchFilterValue, handleSearchFilterChange } =
    useSearchBox();
  const { columns, data, sortingDefault } = votesDefinition();
  const {
    filteredData,
    handleOnChangeSwitch,
    minRewards,
    maxRewards,
    setMinRewards,
    setMaxRewards,
  } = useVoteFilters(data);
  const [tableReady, setTableReady] = useState(false);
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
          props={{ flex: 2 }}
        />
        <VoteFilters
          handleOnChangeSwitch={handleOnChangeSwitch}
          minRewards={minRewards}
          maxRewards={maxRewards}
          setMinRewards={setMinRewards}
          setMaxRewards={setMaxRewards}
          props={{
            flex: 3,
          }}
        />
        <CastVotes flex={3} />
      </HStack>
      {tableReady ? (
        <CustomTable
          tableId="vote"
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

export default VoteBody;
