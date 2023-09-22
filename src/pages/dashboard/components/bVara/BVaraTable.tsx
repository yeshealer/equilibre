import CustomTable from "@/components/core/CustomTable";
import bVaraDefinition from "../../tableDefinitions/BVaraDefinitions";
import { Box } from "@chakra-ui/react";

const BVaraTable = () => {
  const { columns, data } = bVaraDefinition();

  return (
    <Box width={"100%"}>
      <CustomTable
        tableId="bVara"
        columns={columns}
        data={data}
        globalFilter={''}
        onChangeGlobalFilter={() => { }}
      />
    </Box>
  );
};

export default BVaraTable;
