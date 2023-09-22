export const splitterABI = [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [{ type: "address", name: "_voter", internalType: "address" }],
  },
  {
    type: "error",
    name: "InsufficientBalance",
    inputs: [
      { type: "uint256", name: "balanceOfNft", internalType: "uint256" },
      { type: "uint256", name: "totalWeight", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidAmount",
    inputs: [{ type: "uint256", name: "at", internalType: "uint256" }],
  },
  { type: "error", name: "InvalidAmountAndLocksData", inputs: [] },
  {
    type: "error",
    name: "InvalidLockTime",
    inputs: [
      { type: "uint256", name: "at", internalType: "uint256" },
      { type: "uint256", name: "lock", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidWithdrawAmount",
    inputs: [
      { type: "uint256", name: "expected", internalType: "uint256" },
      { type: "uint256", name: "available", internalType: "uint256" },
    ],
  },
  { type: "error", name: "NftLocked", inputs: [] },
  { type: "error", name: "NftNotApproved", inputs: [] },
  { type: "error", name: "TokenIdIsAttached", inputs: [] },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "contract VotingEscrow" }],
    name: "escrow",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "split",
    inputs: [
      { type: "uint256[]", name: "amounts", internalType: "uint256[]" },
      { type: "uint256[]", name: "locks", internalType: "uint256[]" },
      { type: "uint256", name: "_tokenId", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "contract IERC20" }],
    name: "token",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "contract Voter" }],
    name: "voter",
    inputs: [],
  },
] as const;
