import React, { useState } from 'react'; import {
    Box,
    Button,
    Text,
    Flex,
} from '@chakra-ui/react';
import { VeNFT } from '@/interfaces';
import { CONTRACTS } from '@/config/company';
import ExpiryDateInputSection from '@/components/lock/ExpiryDateInputSection';
import { formatTimestamp } from '@/utils/formatTime';
import moment from 'moment';
import callContractWait from '@/lib/callContractWait';
import { useVeTokenStore } from '@/store/veTokenStore';
import { useAccount } from 'wagmi';
import generateToast from '@/components/toast/generateToast';

interface ExtendDurationCardProps {
    Nft: VeNFT;
    getNfts: () => Promise<void>;
}
const ExtendDurationCard: React.FC<ExtendDurationCardProps> = ({
    Nft, getNfts
}) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [unlockDate, setUnlockDate] = useState<string>(formatTimestamp(moment().add(1460, "days").unix()));

    const onExtendPeriod = async () => {
        setLoading(true);
        const lockDuration = moment.duration(moment(unlockDate).diff(moment()));
        const txObj = {
            address: CONTRACTS.VE_TOKEN_ADDRESS,
            abi: CONTRACTS.VE_TOKEN_ABI,
            functionName: 'increase_unlock_time',
            args: [Nft.id, Math.floor(lockDuration.asSeconds())],
        };
        const toastObj = {
            title: 'Extended VeVara',
            description: `ID #${Nft.id} Lock Period Extended to ${unlockDate}`,
        };
        const result = await callContractWait(txObj, toastObj, (error: any) => {
            console.log(error);
            if (String(error).includes("Can only increase lock duration"))
                generateToast("Warning", "The NFT is max locked already. It can’t be extended any longer.", "warning");
            return false;
        });

        setLoading(false);
        if (result) {
            await getNfts();
        }
    }

    const handleChangeUnlockDate = (unlockDate: string) => {
        if (new Date(unlockDate).valueOf() < new Date(Number(Nft.lockEnds) * 1000).valueOf()) {
            generateToast(
                'Date Invalid',
                `It's not allowed to select previous date.`,
                'error'
            );
            return;
        }
        setUnlockDate(unlockDate);
    }

    return (
        <Box
            background={
                'linear-gradient(0deg, rgb(21,32,76), rgb(21,32,76)) padding-box, linear-gradient(to bottom, #CD74CC, #FFBD59 , #70DD88) border-box;'
            }
            w={"100%"}
            minW={'298px'}
            maxW={'528px'}
            padding={0}
            borderRadius={30}
            border={'1px solid transparent'}
            letterSpacing={'1.95px'}>
            {/* title */}
            <Flex
                borderBottom={'1px solid rgba(255, 255, 255, 0.5)'}
                paddingY={4}
                paddingX={7}
                justifyContent={'space-between'}>
                <Text fontSize={'md'} letterSpacing={'wider'}>
                    Extend your Lock:
                </Text>
                <Text fontSize={'md'} color={'pink.500'} letterSpacing={'wider'}>
                    ID #{Nft.id}
                </Text>
            </Flex>

            {/*  body  */}
            <Box padding={'1.5rem 1.75rem'}>
                {/* lock duration input */}
                <ExpiryDateInputSection unlockDate={unlockDate} handleChangeUnlockDate={handleChangeUnlockDate} />

                {/* your veVara info */}
                <Flex
                    fontSize={15}
                    pt={9}
                    pb={9}
                    flexDirection={'column'}
                    gap={4}>
                    <Flex
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        flexDirection={'row'}>
                        <Text
                            fontFamily={'Arista'}
                            fontWeight={300}
                            color={'#F5F5F5'}>
                            You current lock expires on
                        </Text>
                        <Text textAlign={'end'}>
                            {formatTimestamp(Number(Nft.lockEnds), "MM/DD/YYYY")}
                        </Text>
                    </Flex>
                    <Flex
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        flexDirection={'row'}
                        color={'#F5F5F5'}>
                        <Text fontFamily={'Arista'} fontWeight={300}>
                            Your lock will be extended until
                        </Text>
                        <Text color="green.500" textAlign={'end'}>
                            {formatTimestamp(moment(unlockDate).unix(), "MM/DD/YYYY")}
                        </Text>
                    </Flex>
                </Flex>
                {/* Extend Locking Period button */}
                <Flex
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    pt={0}>
                    <Button
                        colorScheme="yellow"
                        w={'100%'}
                        onClick={onExtendPeriod}
                        isLoading={isLoading}
                        borderRadius={'md'}>
                        <Text fontSize={'lg'}>Extend Locking Period</Text>
                    </Button>
                </Flex>
            </Box>
        </Box >
    );
};

export default ExtendDurationCard;
