import generateToast from '@/components/toast/generateToast';
import { chains } from '@/config/wagmi';
import { Token } from '@/interfaces';
import { useSwapStore } from '@/store/features/swap/swapStore';
import { useLocalAssetStore } from '@/store/localAssetsStore';
import { displayNumber } from '@/utils/formatNumbers';
import { AddIcon, DeleteIcon, LinkIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Avatar,
  HStack,
  IconButton,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useWalletClient } from 'wagmi';
import EquilibreAvatar from '../EquilibreAvatar';

type TokenEntryProps = {
  token: Token;
  handleTokenOnClick: (token: Token) => void;
  deleteAndLink?: boolean;
};

const TokenEntry = ({
  token,
  handleTokenOnClick,
  deleteAndLink = false,
}: TokenEntryProps) => {
  const client = useWalletClient();
  const { delLocalAsset } = useLocalAssetStore(state => state);
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
        transition={'transform 0.35s ease-out, background 0.15s ease-out'}>
        <Stack
          direction={'row'}
          alignItems={'center'}
          _hover={{
            cursor: 'pointer',
            color: 'yellow.500',
          }}
          onClick={() => handleTokenOnClick(token)}>
          <EquilibreAvatar size={'md'} src={token.logoURI} />
          <Stack spacing={'-0.5'}>
            <Text fontSize={'sm'}>{token.symbol}</Text>
            <Text fontFamily={'Arista'} fontSize={'sm'} color={'gray.500'}>
              {token.name}
            </Text>
          </Stack>
        </Stack>
        <HStack>
          {deleteAndLink && (
            <HStack textAlign={'right'} spacing={'-0.5'}>
              <Link
                href={chains[0].blockExplorers.default.url.concat(
                  '/address/' + token.address
                )}
                isExternal>
                <IconButton
                  aria-label="Show in explorer"
                  rounded={'full'}
                  variant={'unstyled'}
                  icon={<LinkIcon />}
                  color={'gray.500'}
                  _hover={{
                    cursor: 'pointer',
                    color: 'yellow.500',
                  }}></IconButton>
              </Link>
              <IconButton
                aria-label="Delete local token"
                rounded={'full'}
                variant={'unstyled'}
                icon={<DeleteIcon />}
                color={'gray.500'}
                _hover={{
                  cursor: 'pointer',
                  color: 'yellow.500',
                }}
                onClick={() => {
                  delLocalAsset(token.address);
                }}
              />
            </HStack>
          )}
          <Stack textAlign={'right'} spacing={'-0.5'}>
            <Text fontSize={'sm'}>{displayNumber(token.balance)}</Text>

            <Text fontSize={'sm'} fontFamily={'Arista'} color={'gray.500'}>
              Balance
            </Text>
          </Stack>
        </HStack>
      </Stack>
    </Stack>
  );
};

export default TokenEntry;
