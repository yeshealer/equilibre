import EquilibreAvatar from '@/components/core/EquilibreAvatar';
import generateToast from '@/components/toast/generateToast';
import { Token } from '@/interfaces';
import { useSwapStore } from '@/store/features/swap/swapStore';
import { displayNumber } from '@/utils/formatNumbers';
import { AddIcon } from '@chakra-ui/icons';
import { Stack, Text } from '@chakra-ui/react';
import { useWalletClient } from 'wagmi';

type TokenEntryProps = {
  token: Token;
  type: 'input' | 'output';
  onClose: () => void;
};

const TokenEntry = ({ token, type, onClose }: TokenEntryProps) => {
  const {
    actions: { setAsset },
  } = useSwapStore(state => state);
  const handleOnClick = (): void => {
    setAsset(token.address, type);
    onClose();
  };
  const client = useWalletClient();
  const handleOnClickAddAsset = (): void => {
    if (!client.isSuccess) return;
    client.data
      ?.watchAsset({
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: Number(token.decimals),
          image: token.logoURI,
        },
        type: 'ERC20',
      })
      .then(() => {
        generateToast(
          'Asset added',
          `${token.symbol} has been added to your wallet`,
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
            `${token.symbol} has already been added to your wallet`,
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
        onClick={handleOnClick}>
        <Stack direction={'row'} alignItems={'center'}>
          <EquilibreAvatar size={'md'} name={token.name} src={token.logoURI} />
          <Stack spacing={'-0.5'}>
            <Text fontSize={'sm'}>{token.symbol}</Text>
            <Text fontFamily={'Arista'} fontSize={'sm'} color={'gray.500'}>
              {token.name}
            </Text>
          </Stack>
        </Stack>
        <Stack textAlign={'right'} spacing={'-0.5'}>
          <Text fontSize={'sm'}>{displayNumber(token.balance)}</Text>

          <Text fontSize={'sm'} fontFamily={'Arista'} color={'gray.500'}>
            Balance
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TokenEntry;
