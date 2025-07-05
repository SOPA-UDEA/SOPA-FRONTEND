import { Input } from "@heroui/react";

interface Props {
    scheduleMap: Map<string, number>;
}

export default function TableSchedules({ scheduleMap }: Props) {

    const hours = ["6-8", "8-10", "10-12", "12-14", "14-16", "16-18", "18-20", "20-22"];
    const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"];
    
    return (
    <table className="table-auto border border-gray-300 text-center">
        <thead>
            <tr>
                <th className="border px-4 py-2">Horas</th>
                {days.map((day) => (
                    <th key={day} className="border px-4 py-2">
                        {day}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {hours.map((hour) => (
                <tr key={hour}>
                    <td className="border px-4 py-2">{hour}</td>
                    {days.map((day) => {
                        let keyLetter = day[0]; 
                        if (day === "Miercoles" || day === "Miércoles") {
                            keyLetter = "W";
                        }

                        const scheduleKey = `${keyLetter}${hour}`;
                        const count = scheduleMap.get(scheduleKey) ?? "";

                        const message = count ? `${count} ${count > 1 ? 'veces asignado' : 'vez asignado'}` : "";

                        return (
                            <td key={ scheduleKey } className="border px-4 py-2">
                                <Input
                                    type="text"
                                    readOnly
                                    name={ scheduleKey }
                                    value={ message }
                                    className="w-full px-2 py-1 border rounded text-center"
                                />
                            </td>
                        );
                    })}
                </tr>
            ))}
            </tbody>
    </table>
  );
}