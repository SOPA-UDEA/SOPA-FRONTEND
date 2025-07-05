import { useRelatedGroupsLevel, useRelatedGroupsSchedule, useUpdateGroupSchedules } from "@/hooks/useGroups";
import { Form, Button, ModalContent, Modal, ModalBody, ModalHeader, Select, SelectItem, } from "@heroui/react";
import { useState, useEffect } from "react";
import {ScheduleCountLevel, SeparateSchedules, countSchedules, getInitialsLetters, scheduleCount} from "../helpers/separeteSchedules";
import TableSchedules from "./tableSchedules";
import TableSchedulesLevel from "./tableSchedulesLevel";

interface subjectGroup {
    name: string;
    count: number;
}
interface Props {
    onOpenChange: () => void;
    isOpen: boolean;
    selectedGroupId: number;
    selectedPensumsIds: number[];
    academicScheduleId: number;
}

export default function ModalUpdateGroupsSchedule({ onOpenChange, isOpen, selectedGroupId, selectedPensumsIds, academicScheduleId }: Props) {

    const [scheduleCount, setScheduleCount] = useState(1); 
    const { mutateAsync } = useUpdateGroupSchedules()
    const { data, isLoading } = useRelatedGroupsSchedule(selectedGroupId, selectedPensumsIds, academicScheduleId);
    const { data: dataLevel, isLoading: isLoadingLevel } = useRelatedGroupsLevel(selectedGroupId, selectedPensumsIds, academicScheduleId);
    const [currentSchedules, setCurrentSchedules] = useState<scheduleCount[] | null>(null);
    const [currentSchedulesLevel, setCurrentSchedulesLevel] = useState<ScheduleCountLevel[] | null>(null);
    const [changeType, setChangeType] = useState(false);

    const updateScheduleCount = (type: string) => {
        if (type === 'more') {
            setScheduleCount(prev => prev + 1);
        } else {
            setScheduleCount(prev => prev - 1);
        } 
    };

    useEffect(() => {
        if (data) {
            const allSchedules: string[] = [];
            data.forEach(group => {
                group.classroom_x_group.forEach(classroom => {
                    const schedules = SeparateSchedules(classroom.mainSchedule);
                    allSchedules.push(...schedules);
                });
            });

            setCurrentSchedules(countSchedules(allSchedules))
        }
    }, [data]);

    useEffect(() => {
        if (dataLevel) {
            const scheduleMap = new Map<string, ScheduleCountLevel>();

            dataLevel.forEach(group => {
                const name = group.subject.name;
                const code = group.code;

                group.classroom_x_group.forEach(classroom => {
                    const schedules = SeparateSchedules(classroom.mainSchedule); 

                    schedules.forEach(schedule => {
                        const key = `${name}-${schedule}`;
                        scheduleMap.set(key, {
                            name,
                            schedule,
                            code
                        })
                    })
                });
            });

            const result: ScheduleCountLevel[] = Array.from(scheduleMap.values());
            setCurrentSchedulesLevel(result);
        }
    }, [dataLevel]);

    const [selectedSchedules, setSelectedSchedules] = useState<Array<{
        day: string | null;
        startHour: string | null;
        endHour: string | null;
    }>>([{ day: null, startHour: null, endHour: null }]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const allFilled = selectedSchedules.every(s => s.day && s.startHour && s.endHour);
        if (!allFilled) return alert("Por favor, selecciona un día, hora de inicio y fin en todos los bloques.");

        const days = selectedSchedules.map(s => s.day!);
        const startHours = selectedSchedules.map(s => s.startHour!);
        const endHours = selectedSchedules.map(s => s.endHour!);
        
        // Validar que cada hora de inicio sea menor que la de fin
        const invalidHours = selectedSchedules.some(s => Number(s.startHour) >= Number(s.endHour));
        if (invalidHours) return alert("Las horas de inicio deben ser menor a las horas de fin.");

        const getDayLetter = (day: string) => day === "Miercoles" || day === "Miércoles" ? "W" : day[0];

        // Verificar si todas las horas son iguales
        const sameStart = startHours.every(h => h === startHours[0]);
        const sameEnd = endHours.every(h => h === endHours[0]);

        let formattedSchedules: string[];

        if (sameStart && sameEnd) {
            const daysLetters = days.map(getDayLetter).join("");
            formattedSchedules = [`${daysLetters}${startHours[0]}-${endHours[0]}`];
        } else {
            formattedSchedules = selectedSchedules.map(s =>
                `${getDayLetter(s.day!)}${s.startHour}-${s.endHour}`
            );
        }

        const schedulesFromLevel = (currentSchedulesLevel ?? []).map(s => s.schedule);

        const hasAnyMatch = formattedSchedules.some(schedule =>
            schedulesFromLevel.includes(schedule)
        );

        if (hasAnyMatch) {
            const confirmUpdate = window.confirm("Uno o más horarios ya existen para materias de este nivel. ¿Deseas continuar?");
            if (!confirmUpdate) return;
        }

        await mutateAsync({
            group_id: selectedGroupId,
            schedules: formattedSchedules,
        });
        setSelectedSchedules([{ day: null, startHour: null, endHour: null }]);
        setScheduleCount(1);
        onOpenChange()
    };

    useEffect(() => {
        setSelectedSchedules((prev) => {
            const newArr = [...prev];
            while (newArr.length < scheduleCount) {
            newArr.push({ day: null, startHour: null, endHour: null });
            }
            return newArr.slice(0, scheduleCount);
        });
    }, [scheduleCount]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedSchedules([{ day: null, startHour: null, endHour: null }]);
            setScheduleCount(1);
        }
    }, [isOpen]);

    const handleSelectChange = (index: number, field: "day" | "startHour" | "endHour", value: string) => {
        const updated = [...selectedSchedules];
        updated[index][field] = value;
        setSelectedSchedules(updated);
    };

    const hoursStart = ["6", "8", "10", "12", "14", "16", "18", "20"];
    const hoursEnd = ["8", "10", "12", "14", "16", "18", "20", "22"];
    const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"];

    if (isLoading || isLoadingLevel) return <div>Cargando...</div>;
    
    const scheduleMap = new Map<string, number>(
        currentSchedules?.map(s => [s.schedule, s.count])
    );

    const scheduleMapLevel = new Map<string, subjectGroup>(
        (currentSchedulesLevel ?? []).map(s => [
            s.schedule,
            {
                name: getInitialsLetters(s.name),
                count: s.code
            }
        ])
    );

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent className="w-auto max-w-full">
                <ModalHeader className="flex flex-col gap-1 text-center">
                    Actualizar Horario
                </ModalHeader>
                <ModalBody className="max-h-[80vh] overflow-y-auto">

                    <Form onSubmit={ handleSubmit }>
                        <div className="flex gap-3 w-full">

                            <Button 
                                color="secondary"
                                onPress={ () => updateScheduleCount('more') }
                            >
                                Agregar un día
                            </Button>

                            {scheduleCount > 1 && (
                                <Button 
                                    color="warning"
                                    onPress={ () => updateScheduleCount('less') }
                                >
                                    Eliminar último día
                                </Button>
                            )}
                        </div>
                        {[...Array(scheduleCount)].map((_, index) => (
                            <div key={index} className="flex gap-2 my-2 w-full">
                                <Select
                                    className="max-w-xs"
                                    label={`Día ${index + 1}`}
                                    selectedKeys={selectedSchedules[index]?.day ? [selectedSchedules[index].day!] : []}
                                    onSelectionChange={(keys) =>
                                        handleSelectChange(index, "day", Array.from(keys)[0].toString())
                                    }
                                >
                                    {days.map((day) => (
                                        <SelectItem key={day}>{day}</SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    className="max-w-xs"
                                    label={`Hora de inicio ${index + 1}`}
                                    selectedKeys={selectedSchedules[index]?.startHour ? [selectedSchedules[index].startHour!] : []}
                                    onSelectionChange={(keys) =>
                                        handleSelectChange(index, "startHour", Array.from(keys)[0].toString())
                                    }
                                >
                                    {hoursStart.map((hour) => (
                                        <SelectItem key={String(hour)}>{hour}</SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    className="max-w-xs"
                                    label={`Hora de fin ${index + 1}`}
                                    selectedKeys={selectedSchedules[index]?.endHour ? [selectedSchedules[index].endHour!] : []}
                                    onSelectionChange={(keys) =>
                                        handleSelectChange(index, "endHour", Array.from(keys)[0].toString())
                                    }
                                >
                                    {hoursEnd.map((hour) => (
                                        <SelectItem key={hour}>{hour}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                        ))}

                        {
                            !changeType && <TableSchedules scheduleMap={scheduleMap} />
                        }

                        {
                            changeType && <TableSchedulesLevel scheduleMap={scheduleMapLevel} />
                        }

                         <div className="flex justify-center items-center gap-6 my-4 w-full">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={!changeType}
                                    onChange={() => setChangeType(false)}
                                />
                                <label>Materia</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={changeType}
                                    onChange={() => setChangeType(true)}
                                />
                                <label>Nivel</label>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 items-center">
                            <Button color="secondary" type="submit">
                                Actualizar
                            </Button>
                            <Button
                                color="default"
                                type="button"
                                onPress={ () => onOpenChange() }
                                className="bg-red-500 text-white"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}