export const CustomDataGridItems = ({ data }: { data: any[] }) => {
    return (
      <>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(item).map((value, colIndex) => (
              <td key={colIndex} className="border border-gray-300 px-4 py-2">
                {String(value)}
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  };
  