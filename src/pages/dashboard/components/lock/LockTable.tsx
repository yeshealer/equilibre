import CustomTable from "@/components/core/CustomTable";
import locksDefinition from "../../tableDefinitions/LocksDefinition";

const LockTable = () => {
  const { columns, data } = locksDefinition();

  return <>
    <CustomTable
      tableId="lock"
      columns={columns}
      data={data}
      globalFilter={''}
      onChangeGlobalFilter={() => { }}
    /></>;
};

export default LockTable;
