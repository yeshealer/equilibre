import generateToast from '@/components/toast/generateToast';
import { CONTRACTS } from '@/config/company';
import { Pair } from '@/interfaces';
import { displayNumber } from '@/utils/formatNumbers';
import { AddIcon } from '@chakra-ui/icons';
import { HStack, Stack, Text } from '@chakra-ui/react';
import { useWalletClient } from 'wagmi';
import EquilibreAvatar from '../EquilibreAvatar';

type PairEntryProps = {
  pair: Pair;
  handlePairOnClick: (pair: Pair) => void;
};

const PairEntry = ({ pair, handlePairOnClick }: PairEntryProps) => {
  const client = useWalletClient();
  const handleOnClickAddAsset = (): void => {
    if (!client.isSuccess) return;
    client.data
      ?.watchAsset({
        options: {
          address: pair.address,
          symbol: pair.symbol,
          decimals: Number(pair.decimals),
          image: CONTRACTS.GOV_TOKEN_LOGO,
        },
        type: 'ERC20',
      })
      .then(() => {
        generateToast(
          'Asset added',
          `${pair.symbol} has been added to your wallet`,
          'success'
        );
      })
      .catch(err => {
        if (err.message.includes('Rabby')) {
          generateToast(
            'Rabby functionality not available',
            err.message.split('\n')[2],
            'error'
          );
          return;
        } else {
          generateToast(
            'Asset already added',
            `${pair.symbol} has already been added to your wallet`,
            'error'
          );
        }
      });
  };

  return (
    <Stack direction={'row'} alignItems={'center'}>
      <AddIcon
        boxSize={3}
        color={'green.500'}
        transition={'transform 0.35s ease-out, background 0.15s ease-out'}
        _hover={{
          transform: 'scale(1.15, 1.15)',
          cursor: 'pointer',
        }}
        _active={{ transform: 'scale(1, 1)' }}
        onClick={handleOnClickAddAsset}
      />
      <Stack
        direction={'row'}
        alignItems={'center'}
        w={'-webkit-fill-available'}
        justifyContent={'space-between'}
        transition={'transform 0.35s ease-out, background 0.15s ease-out'}
        _hover={{
          cursor: 'pointer',
          color: 'yellow.500',
        }}
        onClick={() => handlePairOnClick(pair)}>
        <Stack direction={'row'} alignItems={'center'}>
          <HStack spacing={-2}>
            <EquilibreAvatar src={pair?.token0?.logoURI} size={'sm'} />
            <EquilibreAvatar src={pair?.token1?.logoURI} size={'sm'} />
          </HStack>
          <Stack spacing={'-0.5'}>
            <Text fontSize={'sm'}>{pair.symbol.substring(5)}</Text>
            <Text fontFamily={'Arista'} fontSize={'sm'} color={'gray.500'}>
              {pair.symbol}
            </Text>
          </Stack>
        </Stack>
        <Stack textAlign={'right'} spacing={'-0.5'}>
          <Text fontSize={'sm'}>{displayNumber(pair.balanceStaked)}</Text>

          <Text fontSize={'sm'} fontFamily={'Arista'} color={'gray.500'}>
            Balance
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PairEntry;
