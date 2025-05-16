import { ColumnConfig } from "./CustomDataGrid";

interface CustomDataGridColumnsProps {
  headers: ColumnConfig[];
  actions?: boolean;
  checkbox?: boolean;
}

export const CustomDataGridColumns = ({ headers, actions, checkbox }: CustomDataGridColumnsProps) => {
  return (
    <tr>
      {checkbox && (
        <th className="px-4 py-2">
          <input type="checkbox" />
        </th>
      )}
      {headers.map(({ headerName, field }) => (
        <th key={field} className="border border-gray-300 px-4 py-2">
          {headerName}
        </th>
      ))}
      {actions && <th className="px-4 py-2">Acciones</th>}
    </tr>
  );
};
