import { Box } from "@chakra-ui/react";
import { useState } from "react";

type ProgressBarProps = {
  rate: number;
};

const ProgressBar = ({ rate }: ProgressBarProps) => {
  // const [styleString, setStyleString] = useState<string>("");

  let styleString;
  if (rate > 50.3)
    styleString = `linear-gradient(90deg, #CD74CC 0%, #FFBD59 50.3%, #70DD88 ${rate - 0.01}%,  #0B194B ${rate}%) padding-box`;
  else
    styleString = `linear-gradient(90deg, #CD74CC 0%, #FFBD59 ${rate - 0.01}%, #0B194B ${rate}%) padding-box`;

  return (
    <Box
      borderRadius="10px"
      width="475px"
      height="14px"
      maxWidth="100%"
      border={'1px solid transparent'}
      background={
        styleString
        + (!!styleString ? " , " : "") +
        'linear-gradient(90deg, #CD74CC 0%, #FFBD59 50.31%, #70DD88 64.57%) border-box'
      } />
  );
};

export default ProgressBar;
