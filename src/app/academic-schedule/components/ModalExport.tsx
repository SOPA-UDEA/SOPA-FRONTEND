import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { useGetGroupsToExport } from "@/hooks/useGroups";
import { ModalHeader, ModalBody, Button, ModalContent, Modal } from "@heroui/react";
import { tableData } from "../helpers/groupTableData";

interface Props{
    scheduleId: number;
    pensumId: number;
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
}

export default function ModalExport({scheduleId, pensumId, isOpen, onOpenChange, onClose}: Props) {

    const {data: dataExport, isPending } = useGetGroupsToExport(pensumId, scheduleId);

    if (!dataExport) return null;
    const dataExcel = tableData(dataExport)

    const handleExportExcel = () => {
        console.log('hola');
        
        if (dataExcel.length === 0) return;
        // Define los datos planos que quieres exportar
        const dataExport = dataExcel?.map(group => ({
            Código_Espejo: group.mirror_group.name,
            Código_Materia: group.subject.code,
            Materia: group.subject.name,
            Grupo: group.code,
            Max_Cupos: group.maxSize,
            Cupos: group.groupSize,
            Matriculados: group.registeredPlaces,
            Aulas: group.classrooms,
            Horarios: group.schedules,
            Profesores: group.professorsN,
            Modalidad_Grupo: group.modality,
        }));

        if (!dataExport) {
            return
        }

        // Crea un libro y hoja
        const worksheet = XLSX.utils.json_to_sheet(dataExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Programación");

        // Convierte a blob y descarga
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "programacion_academica.xlsx");
    };

    const handleDownload = () => {
        handleExportExcel();
        onOpenChange();
    }

    return(
         <>
           <Modal
                
                isOpen={isOpen}
                onOpenChange={(open) => {
                    if (!open) onClose();
                }}
            >
                <ModalContent>
                    {() => {
                        return (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Selecciona el Pensum
                                </ModalHeader>
                                <ModalBody>
                                    {
                                        isPending && <span>Cargando...</span>
                                    }
                                    {!isPending && 
                                        <>
                                            <span>Ya está listo para ser descargado...</span>
                                            <Button color="secondary"
                                            type="button"
                                                onPress={ () => handleDownload() }
                                            >
                                                Seleccionar
                                            </Button>
                                        </>
                                    }
                                </ModalBody>
                            </>
                        );
                    }}
                </ModalContent> 
            </Modal>
        </>
    )

}