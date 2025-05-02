import { CustomDataGridColumns } from "./CustomDataGridColumns"
import { CustomDataGridItems } from "./CustomDataGridItems"
import PropTypes from 'prop-types';

export const CustomDataGrid = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return <p>No hay datos</p>;


  const headers = Object.keys(data[0]);
  return (
    <table className="table-auto border-separate border-spacing-0 rounded-lg overflow-hidden border border-gray-400">
        <thead>
          <CustomDataGridColumns headers={headers}  />

        </thead>
        <tbody>
          <CustomDataGridItems data={data} />
        </tbody>
    </table>
  )

 }

 CustomDataGrid.propTypes = {
  data: PropTypes.array.isRequired,
  
}
 