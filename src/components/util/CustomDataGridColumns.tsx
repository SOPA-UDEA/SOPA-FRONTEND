

export const CustomDataGridColumns = ({ headers }: { headers: string[] }) => {
  return (
    <tr>
      {headers.map((header) => (
        <th key={header} className="border border-gray-300 px-4 py-2">
          {header}
        </th>
      ))}
    </tr>
  );
};

