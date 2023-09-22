import { Stack } from '@chakra-ui/react';
import RewardCard from './RewardCard';

const RewardBody = () => {
  return (
    <Stack
      // width={{ base: '320px', lg: '100%' }}
      width={'100%'}
      direction={{ base: 'column', lg: 'row' }}
      alignSelf={'center'}
      justifyContent={'space-between'}
      gap={12}
      h={{
        base: 'max-content',
        lg: '60',
      }}>
      <RewardCard type={'Emissions'}></RewardCard>
      <RewardCard type={'Fees'}></RewardCard>
      <RewardCard type={'Bribes'}></RewardCard>
      <RewardCard type={'Rebase'}></RewardCard>
    </Stack>
  );
};

export default RewardBody;
