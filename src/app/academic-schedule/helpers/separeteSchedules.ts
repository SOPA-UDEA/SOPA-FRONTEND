export interface scheduleCount{
    schedule: string;
    count: number;
}

export interface ScheduleCountLevel {
    schedule: string;
    code: number;
    name: string;
}

export function SeparateSchedules(horario: string): string[] {

  const diasRegex = /^[A-Z]+/; // Coincide con todos los caracteres en mayúscula al principio
  const horasRegex = /[0-9]{1,2}-[0-9]{1,2}$/; // Coincide con el formato de hora, por ejemplo 12-14

  const diasMatch = horario.match(diasRegex);
  const horasMatch = horario.match(horasRegex);

  if (!diasMatch || !horasMatch) {
    throw new Error("Formato de horario no válido");
  }

  const dias = diasMatch[0].split(""); 
  const horas = horasMatch[0];     

  return dias.map(dia => `${dia}${horas}`);
}

export function countSchedules(schedules: string[]): scheduleCount[] {
    const countMap: Record<string, number> = {};

    for (const schedule of schedules) {
        countMap[schedule] = (countMap[schedule] || 0) + 1;
    }

    return Object.entries(countMap).map(([schedule, count]) => ({
        schedule,
        count
    }));
}

export const getInitialsLetters = (name: string): string => {
  return name
    .split(" ")
    .filter(Boolean)              // elimina espacios extra
    .map(word => word[0].toUpperCase()) // toma primera letra en mayúscula
    .join("");
};