import { SquidWidget } from '@0xsquid/widget';
import { Box } from '@chakra-ui/react';

const CrossChainSwap = () => {
  return (
    <Box ml={{ md: 2 }} w={{ md: 'md' }}>
      <SquidWidget
        config={{
          integratorId: 'equilibrefinance-swap-widget',
          companyName: 'Equilibre',
          style: {
            neutralContent: "#b0b0b0",
            baseContent: "#ffffff",
            base100: "#2b408b",
            base200: "#1f2d64",
            base300: "#2b408b",
            error: "#ff5660",
            warning: "#ffbd59",
            success: "#70dd88",
            // primary: "#0d142e",
            secondary: "#f5ba58",
            secondaryContent: "#0d142e",
            neutral: "#192555",
            roundedBtn: "26px",
            roundedCornerBtn: "999px",
            roundedBox: "1rem",
            roundedDropDown: "20rem"
          },
          initialFromChainId: 2222,
          slippage: 1.5,
          infiniteApproval: false,
          apiUrl: 'https://api.squidrouter.com',
          mainLogoUrl: '',
          comingSoonChainIds: [
            'cosmoshub-4',
            'injective-1',
            'axelar-dojo-1',
            'kichain-2',
          ],
          titles: {
            swap: '',
            settings: 'Settings',
            wallets: 'Wallets',
            tokens: 'Tokens',
            chains: 'Chains',
            history: 'History',
            transaction: 'Transaction',
            allTokens: 'Tokens',
            destination: 'Destination address',
          },
          priceImpactWarnings: {
            warning: 3,
            critical: 5,
          },
        }}
      />
    </Box>
  );
};




export default CrossChainSwap;
