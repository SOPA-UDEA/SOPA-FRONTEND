import { Button } from "@heroui/react";



interface CustomDataGridProps {
  data: any[];
  actions?: boolean;
  checkbox?: boolean;
}
export const CustomDataGridItems = ({ data, actions, checkbox }: CustomDataGridProps) => {
    return (
      <>

        {data.map((item, rowIndex) => (
          <tr key={rowIndex}>
            { checkbox &&( <td className="border border-gray-300 px-4 py-2"><input type="checkbox" /></td> )}
            {Object.values(item).map((value, colIndex) => (
              <td key={colIndex} className="border border-gray-300 px-4 py-2">
                {String(value)}
              </td>
            ))}
            {actions &&( <td className="border border-gray-300 px-4 py-2"><Button>Boton</Button></td> )}
          </tr>
        ))}
      </>
    );
  };
  