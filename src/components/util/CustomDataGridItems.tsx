import { Button } from "@heroui/react";
import { ColumnConfig } from "./CustomDataGrid";
interface CustomDataGridItemsProps {
  data: any[];
  columns: ColumnConfig[];
  actions?: boolean;
  checkbox?: boolean;
}

export const CustomDataGridItems = ({ data, columns, actions, checkbox }: CustomDataGridItemsProps) => {
  return (
    <>
      {data.map((item, rowIndex) => (
        <tr key={rowIndex}>
          {checkbox && (
            <td className="border border-gray-300 px-4 py-2">
              <input type="checkbox" />
            </td>
          )}
          {columns.map(({ field }, colIndex) => (
            <td key={colIndex} className="border border-gray-300 px-4 py-2">
              {String(item[field])}
            </td>
          ))}
          {actions && (
            <td className="border border-gray-300 px-4 py-2">
              <Button>Botón</Button>
            </td>
          )}
        </tr>
      ))}
    </>
  );
};