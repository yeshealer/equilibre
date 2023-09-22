import { SearchIcon } from '@chakra-ui/icons';
import {
  ChakraProps,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';

interface SearchBoxProps {
  props?: ChakraProps;
  searchFilterValue: string;
  handleSearchFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const SearchBox = ({
  searchFilterValue,
  handleSearchFilterChange,
  props,
}: SearchBoxProps) => {
  // const { searchFilterValue, handleSearchFilterChange } = useSearchBox();
  return (
    <InputGroup {...props}>
      <Input
        placeholder="KAVA, VARA, axlUSDC..."
        textAlign={'left'}
        size={'xl'}
        borderRadius={'3xl'}
        pl={'12'}
        value={searchFilterValue}
        onChange={handleSearchFilterChange}
      />
      <InputLeftElement
        top={3}
        left={2}
        pointerEvents="none"
        color="gray.300"
        fontSize="1.2em"
        children={
          <SearchIcon
            color={'whiteAlpha.400'}
            _active={{ color: 'yellow.500' }}
          />
        }
      />
    </InputGroup>
  );
};

export default SearchBox;
