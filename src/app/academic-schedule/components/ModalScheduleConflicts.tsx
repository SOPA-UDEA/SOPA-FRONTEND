import { useGetScheduleConflicts } from "@/hooks/useGroups";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, RadioGroup, Radio } from "@heroui/react";
import { useRef, useState } from "react";

interface Props {
    selectedPesnums: number[];
    scheduleId: number;
}

export default function ModalScheduleConflicts({ selectedPesnums, scheduleId }: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const onCloseRef = useRef<() => void>(() => {});
    const { data, isLoading, refetch  } = useGetScheduleConflicts(selectedPesnums, scheduleId);

    const [filterType, setFilterType] = useState<"name" | "level">("name");

    const handleOpen = () => {
        refetch();
        onOpen();
    }

    return (
        <div>
            <Button color="secondary" onPress={handleOpen}>Conflictos de horarios</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent className="w-full max-w-5xl">
                    {(onClose) => {
                    onCloseRef.current = onClose;
                    return (
                        <>
                        <ModalHeader className="flex flex-col gap-1 text-center">
                            Conflictos de horarios
                        </ModalHeader>
                        <ModalBody className="max-h-[80vh] overflow-y-auto relative">
                            {isLoading && <span>Cargando conflictos...</span>}

                            {!isLoading && (
                            <div className="space-y-6 relative">
                                {/* Radios fijos */}
                                <div className="sticky top-0 z-10 bg-white py-4 border-b">
                                <RadioGroup
                                    label="Ver conflictos por:"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as "name" | "level")}
                                    orientation="horizontal"
                                >
                                    <Radio value="name">Materia</Radio>
                                    <Radio value="level">Nivel</Radio>
                                </RadioGroup>
                                </div>

                                {/* Contenido dinámico */}
                                {filterType === "name" && (
                                <div className="border rounded p-4 bg-gray-50">
                                    <h3 className="font-semibold mb-2">Conflictos por materia</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                    {data?.filter((c) => c.type === "name").map((conflict, idx) => (
                                        <li key={`name-${idx}`}>
                                        <p><strong>Materia:</strong> {conflict.key}</p>
                                        <p><strong>Horarios:</strong> {conflict.conflicting_schedules.join(", ")}</p>
                                        <p><strong>Grupos:</strong> {conflict.groupA_code} - {conflict.groupB_code}</p>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                                )}

                                {filterType === "level" && (
                                <div className="border rounded p-4 bg-gray-50">
                                    <h3 className="font-semibold mb-2">Conflictos por nivel</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {data?.filter((c) => c.type === "level").map((conflict, idx) => (
                                            <li key={`level-${idx}`}>
                                            <p><strong>Materia 1:</strong> {conflict.groupA_name}</p>
                                            <p><strong>Materia 2:</strong> {conflict.groupB_name}</p>
                                            <p><strong>Horarios:</strong> {conflict.conflicting_schedules.join(", ")}</p>
                                            <p><strong>Grupos:</strong> {conflict.groupA_code} - {conflict.groupB_code}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                )}
                            </div>
                            )}
                        </ModalBody>
                        </>
                    );
                    }}
                </ModalContent>
                </Modal>

        </div>
    );
}
