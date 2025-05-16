interface CustomDataGridProps {
  headers: string[];
  actions?: boolean;
  checkbox?: boolean;
}

export const CustomDataGridColumns = ({ headers, actions, checkbox }: CustomDataGridProps) => {
  return (
    <tr>
      {
        checkbox && (
        <th className="px-4 py-2">
          <input type="checkbox" />
        </th>
        )
      }
      {headers.map((header) => (
        
        <th key={header} className="border border-gray-300 px-4 py-2">
          {header}
        </th>
        
      ))}
       {
        actions && (
        <th className="px-4 py-2">
          Acciones
        </th>
        )
      }
    </tr>
    
  );
};

