import moment from 'moment';

import { CONSTANTS_VEVARA } from '@/config/constants';
import { VeNFT } from '@/interfaces';
import {
    Box,
    Button,
    Input,
    SimpleGrid,
    Text,
    Flex,
    Image,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    VStack,
} from '@chakra-ui/react';
import useVeVaraMerge from '@/hooks/dashboard/useVeVaraMerge';
import {
    getDurationString,
    getDurationStringFromNow,
} from '@/utils/formatTime';
import { displayCurrency, displayNumber } from '@/utils/formatNumbers';
import { useState } from 'react';

const VeVaraMerge = () => {
    const {
        firstSelectedNFTId,
        secondSelectedNFTId,
        isLoading,
        veNFTs,

        setFirstSelectedNFTId,
        setSecondSelectedNFTId,
        onMergeVeNFTs,
        // onClickSplit,
        onClickBack,
    } = useVeVaraMerge();

    const filteredNfts = veNFTs.filter(value => value.lockEnds > moment().unix());

    const longerLockDate = Number(
        filteredNfts[firstSelectedNFTId]?.lockEnds >
            filteredNfts[secondSelectedNFTId]?.lockEnds
            ? filteredNfts[firstSelectedNFTId]?.lockEnds
            : filteredNfts[secondSelectedNFTId]?.lockEnds
    );
    const lockedDurationString = getDurationStringFromNow(longerLockDate);

    return (
        <Box
            background={
                'linear-gradient(156.7deg, #15204c 4.67%, #1F2E64 73.14%, #924C91 126.09%) no-repeat padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box'
            }
            w={['298px', '553px']}
            h={'100%'}
            maxW={'553px'}
            borderRadius={'30px'}
            // padding={{ base: 0, sm: 6 }}
            border={'1px solid transparent'}
            letterSpacing={'widest'}>
            {/* body */}
            <Box padding={[5, 6]}>
                {/* select NFTs to merge */}
                <VStack
                    paddingBottom={[8, 10]}
                    paddingTop={4}
                    paddingRight={2}
                    gap={[4, 10]}>
                    {/* first select */}
                    <Flex
                        justifyContent={'space-between'}
                        width={'100%'}
                        alignItems={'center'}
                        gap={3}>
                        <Image
                            w={['37px', '58px']}
                            h={['37px', '58px']}
                            src="/images/VARA.svg"
                        />
                        <Menu>
                            <MenuButton
                                id="firstSelect"
                                as={Button}
                                borderRadius={['10px', '15px']}
                                width={['202px', '415px']}
                                height={['30px', '61px']}
                                fontSize={['2xs', 'md']}
                                textColor="yellow.500"
                                _active={{
                                    bgGradient: 'linear-gradient(to right, #CD74CC, #FFBD59 , #70DD88)',
                                    textColor: "darkblue.500",
                                }
                                }
                                padding={3}
                                paddingRight={[3, 8]}
                                tabIndex={firstSelectedNFTId}
                                role={'group'}
                                rightIcon={
                                    <Image
                                        _groupActive={{
                                            filter: "invert(80%);"
                                        }}
                                        _groupHover={{
                                            filter: "invert(80%);"
                                        }}
                                        src={"/images/down-arrow-small.png"}
                                        width={2}
                                        height={1.5}
                                    />
                                }>
                                <Flex justifyContent={'space-between'} paddingLeft={[1, 7]}>
                                    <Text>ID #{filteredNfts[firstSelectedNFTId]?.id}</Text>
                                    <Text>
                                        {displayNumber(
                                            filteredNfts[firstSelectedNFTId]?.lockAmount
                                        )}
                                    </Text>
                                </Flex>
                            </MenuButton>
                            <MenuList
                                bg={'blue.500'}
                                borderRadius={'xl'}
                                width={['202px', '415px']}
                                minWidth={['202px', '415px']}>
                                {filteredNfts.map((row: VeNFT, index: number) => {
                                    return (
                                        <MenuItem
                                            width={['202px', '415px']}
                                            key={row.id}
                                            bg={'blue.500'}
                                            margin={0}
                                            _hover={{
                                                color: 'yellow.500',
                                                textDecoration: 'none',
                                            }}
                                            onClick={() => {
                                                setFirstSelectedNFTId(
                                                    filteredNfts.findIndex(nft => nft.id === row.id)
                                                );
                                            }}>
                                            <Flex
                                                justifyContent={'space-between'}
                                                paddingInline={8}
                                                fontSize={['2xs', 'md']}
                                                width={'100%'}>
                                                <Text>ID #{row.id} </Text>
                                                <Text>{displayNumber(row.lockAmount)}</Text>
                                            </Flex>
                                        </MenuItem>
                                    );
                                })}
                            </MenuList>
                        </Menu>
                    </Flex>

                    <Text
                        pl={6}
                        alignSelf={'center'}
                        color={'green.500'}
                        fontFamily={'Righteous'}
                        fontWeight={400}
                        hideFrom={'sm'}>
                        +
                    </Text>
                    {/* second select */}

                    <Flex
                        justifyContent={'space-between'}
                        width={'100%'}
                        alignItems={'center'}

                        gap={3}>
                        <Image
                            w={['37px', '58px']}
                            h={['37px', '58px']}
                            src="/images/VARA.svg"
                        />
                        <Menu>
                            <MenuButton
                                id="secondSelect"
                                as={Button}
                                borderRadius={['10px', '15px']}
                                width={['202px', '415px']}
                                height={['30px', '61px']}
                                fontSize={['2xs', 'md']}
                                textColor="yellow.500"
                                _active={{
                                    bgGradient: 'linear-gradient(to right, #CD74CC, #FFBD59 , #70DD88)',
                                    textColor: "darkblue.500"
                                }}
                                padding={3}
                                paddingRight={[3, 8]}
                                tabIndex={secondSelectedNFTId}
                                role={'group'}
                                rightIcon={
                                    <Image
                                        _groupActive={{
                                            filter: "invert(80%);"
                                        }}
                                        _groupHover={{
                                            filter: "invert(80%);"
                                        }}
                                        src={"/images/down-arrow-small.png"}
                                        width={2}
                                        height={1.5}
                                    />
                                }>
                                <Flex justifyContent={'space-between'} paddingLeft={[1, 7]}>
                                    <Text>ID #{filteredNfts[secondSelectedNFTId]?.id}</Text>
                                    <Text>
                                        {displayNumber(
                                            filteredNfts[secondSelectedNFTId]?.lockAmount
                                        )}
                                    </Text>
                                </Flex>
                            </MenuButton>
                            <MenuList
                                bg={'blue.500'}
                                borderRadius={'xl'}
                                width={['202px', '415px']}
                                minWidth={['202px', '415px']}>
                                {filteredNfts.map((row: VeNFT, index: number) => {
                                    return (
                                        <MenuItem
                                            key={row.id}
                                            bg={'blue.500'}
                                            margin={0}
                                            _hover={{
                                                color: 'yellow.500',
                                                textDecoration: 'none',
                                            }}
                                            onClick={() => {
                                                setSecondSelectedNFTId(
                                                    filteredNfts.findIndex(nft => nft.id === row.id)
                                                );
                                            }}>
                                            <Flex
                                                justifyContent={'space-between'}
                                                fontSize={['2xs', 'md']}
                                                paddingInline={8}
                                                width={'100%'}>
                                                <Text>ID #{row.id} </Text>
                                                <Text>{displayNumber(row.lockAmount)}</Text>
                                            </Flex>
                                        </MenuItem>
                                    );
                                })}
                            </MenuList>
                        </Menu>
                    </Flex>
                </VStack>

                {/* selected NFTs info */}
                <Flex
                    justifyContent={'space-between'}
                    width={'100%'}
                    alignItems={'center'}
                    hideBelow={'sm'}>
                    <Box w={['37px', '58px']} />
                    <SimpleGrid
                        width={['202px', '415px']}
                        columns={2}
                        paddingTop={8}
                        pr={4}
                        rowGap={5}
                        fontSize={['sm', 'md']}
                        borderTop={'1px solid rgba(255, 255, 255, 0.50)'}>
                        <Text fontFamily={'Arista'}>Total VARA</Text>
                        <Text textAlign={'right'} color={'green.500'}>
                            {displayNumber(
                                filteredNfts[firstSelectedNFTId]?.lockAmount +
                                filteredNfts[secondSelectedNFTId]?.lockAmount
                            )}
                        </Text>
                        <Text fontFamily={'Arista'}>Total veVARA</Text>
                        <Text textAlign={'right'} color={'green.500'}>
                            {displayNumber(
                                filteredNfts[firstSelectedNFTId]?.lockValue +
                                filteredNfts[secondSelectedNFTId]?.lockValue
                            )}
                        </Text>
                        <Text fontFamily={'Arista'}>Locking Ends On</Text>
                        <Text textAlign={'right'} color={'green.500'}>
                            {longerLockDate
                                ? moment(longerLockDate * 1000).format('MM/DD/YYYY')
                                : '--/--/----'}
                        </Text>
                    </SimpleGrid>
                </Flex>
                <Box paddingLeft={0} hideFrom={'sm'}>
                    <SimpleGrid
                        justifyContent={'space-between'}
                        hideFrom={'sm'}
                        columns={3}
                        borderTop={'1px solid rgba(255, 255, 255, 0.25)'}
                        paddingTop={[4, 8]}
                        fontSize={['2xs', 'md']}
                        textColor={'green.500'}
                        textAlign={'center'}
                        letterSpacing={'1.3px'}>
                        <Box height="42px" paddingTop={2} width={'100%'}>
                            <Text fontFamily={'Arista'}>Total VARA</Text>
                            <Text fontWeight={400} fontFamily={'Righteous'}>
                                {displayNumber(
                                    filteredNfts[firstSelectedNFTId]?.lockAmount +
                                    filteredNfts[secondSelectedNFTId]?.lockAmount
                                )}
                            </Text>
                        </Box>
                        <Box
                            height="42px"
                            paddingTop={2}
                            width={'100%'}
                            borderLeft={'1px solid rgba(255,255,255,0.5)'}>
                            <Text fontFamily={'Arista'}>Locked For</Text>
                            <Text fontWeight={400} fontFamily={'Righteous'}>
                                {longerLockDate ? lockedDurationString : '--'}
                            </Text>
                        </Box>
                        <Box
                            height="42px"
                            paddingTop={2}
                            width={'100%'}
                            borderLeft={'1px solid rgba(255,255,255,0.5)'}>
                            <Text fontFamily={'Arista'}>Total veVARA</Text>
                            <Text fontWeight={400} fontFamily={'Righteous'}>
                                {displayNumber(
                                    filteredNfts[firstSelectedNFTId]?.lockValue +
                                    filteredNfts[secondSelectedNFTId]?.lockValue
                                )}
                            </Text>
                        </Box>
                    </SimpleGrid>
                    {/* </Flex> */}
                </Box>

                {/* merge and back button */}
                <Flex alignItems={'center'} justifyContent={'space-between'} pt={7}>
                    <Button
                        h={['23px', '42px']}
                        minW={['23px', '44px']}
                        colorScheme="pink"
                        variant={'outlineSelected'}
                        fontSize={[10, 20]}
                        padding={0}
                        borderRadius={[7, 10]}
                        onClick={onClickBack}>
                        {`<`}
                    </Button>
                    <Button
                        colorScheme="yellow"
                        w={['215px', '414px']}
                        h={['34px', '61px']}
                        fontSize={['md', 'xl']}
                        py={3}
                        borderRadius={['lg', '2xl']}
                        isLoading={isLoading}
                        isDisabled={firstSelectedNFTId === secondSelectedNFTId}
                        onClick={onMergeVeNFTs}>
                        Merge
                    </Button>
                </Flex>
            </Box>
        </Box >
    );
};
export default VeVaraMerge;
