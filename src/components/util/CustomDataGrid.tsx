import { CustomDataGridColumns } from "./CustomDataGridColumns"
import { CustomDataGridItems } from "./CustomDataGridItems"
import PropTypes from 'prop-types';

interface CustomDataGridProps {
  data: any[];
  actions?: boolean;
  checkbox?: boolean;
}

export const CustomDataGrid = ({ data, actions = false, checkbox = false }: CustomDataGridProps) => {
  if (!data || data.length === 0) return (
    <table className="table-auto border-separate border-spacing-0 rounded-lg overflow-hidden border border-gray-400">
      <thead>
        <tr>
          {Object.keys(data[0] || {}).map((key) => (
            <th key={key} className="px-4 py-2 text-left">{key}</th>
          ))}
        </tr>
      </thead>
    </table>
  );


  const headers = Object.keys(data[0]);
  return (
    <table className="table-auto border-separate border-spacing-0 rounded-lg overflow-hidden border border-gray-400">
        <thead>
          <CustomDataGridColumns headers={headers} checkbox={checkbox} actions={actions}/>

        </thead>
        <tbody>
          <CustomDataGridItems data={data} checkbox={checkbox} actions={actions}/>
        </tbody>
    </table>
  )

 }

 CustomDataGrid.propTypes = {
  data: PropTypes.array.isRequired
}
 