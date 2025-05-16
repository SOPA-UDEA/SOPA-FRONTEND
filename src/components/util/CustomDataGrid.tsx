import { CustomDataGridColumns } from "./CustomDataGridColumns"
import { CustomDataGridItems } from "./CustomDataGridItems"
import PropTypes from 'prop-types';

export interface ColumnConfig {
  field: string;
  headerName: string;
}

interface CustomDataGridProps {
  data: any[];
  actions?: boolean;
  checkbox?: boolean;
  columns?: ColumnConfig[];
}

export const CustomDataGrid = ({ data, actions = false, checkbox = false, columns }: CustomDataGridProps) => {
  
  if (!Array.isArray(data) || data.length === 0 || !data[0]) {
    return (
      <div className="p-4">
        <p className="text-center">No hay datos para mostrar</p>
      </div>
    );
  }

  // Usa las columnas personalizadas si se pasan, si no, usa todas
  const headers = columns ?? Object.keys(data[0]).map((key) => ({ field: key, headerName: key }));

  return (
    <table className="table-auto border-separate border-spacing-0 rounded-lg overflow-hidden border border-gray-400">
        <thead>
          <CustomDataGridColumns headers={headers} checkbox={checkbox} actions={actions}/>

        </thead>
        <tbody>
          <CustomDataGridItems data={data} columns={headers} checkbox={checkbox} actions={actions} />
        </tbody>
    </table>
  )

 }

 CustomDataGrid.propTypes = {
  data: PropTypes.array.isRequired
}
 