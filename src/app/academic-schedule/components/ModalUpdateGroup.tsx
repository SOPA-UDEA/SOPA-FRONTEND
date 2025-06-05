import { CustomDataGrid } from "@/components/util/CustomDataGrid";
import { CustomNotification } from "@/components/util/CustomNotification";
import { useForm } from "@/hooks/useForm";
import { useUpdateGroupById } from "@/hooks/useGroups";
import { useProfessors } from "@/hooks/useProfessor";
import { GroupRequestUpdate } from "@/interface/Group";
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, Selection } from "@heroui/react";
import { useRef, useState } from "react";

interface Props {
    isOpen: boolean;
    onOpenChange: () => void;
    selectedGroup: GroupRequestUpdate;
    groupId: number;
    setUpdated: (a: boolean) => void;
}

export default function ModalUpdateGroup({ isOpen, onOpenChange, selectedGroup, groupId, setUpdated }: Props) {
    const initialFormState = {
        'Tamaño del grupo': selectedGroup.groupSize,
        'Tamaño máximo del grupo': selectedGroup.maxSize,
        'Cupos matriculados': selectedGroup.registeredPlaces,
        'Modalidad del grupo': selectedGroup.modality,
    };
    const {formState, onInputChange, onResetForm } = useForm(initialFormState);
    const { mutateAsync } = useUpdateGroupById();

    const { 
        isOpen: isOpenProfessor, 
        onOpenChange: onOpenChangeProfessor, 
        onOpen: onOpenProfessor 
    } = useDisclosure();

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [message, setmessage] = useState("");

    const onCloseRef = useRef<() => void>(() => {});  

    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set((selectedGroup.professors).map((p) => String(p))));

    const handleSelectionChange = (keys: Selection) => {
        setSelectedKeys(keys);
    };

    const { data } = useProfessors();
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const allProfessorIds = (data || []).map(p => p.id);
        const professors =
            selectedKeys === "all"
                ? allProfessorIds
                : Array.from(selectedKeys as Set<string>)
                    .map(id => Number(id))
                    .filter(id => !isNaN(id));
        
        mutateAsync({ groupId: groupId, group: {
            groupSize: Number(formState["Tamaño del grupo"]),
            modality: formState["Modalidad del grupo"],
            maxSize: Number(formState["Tamaño máximo del grupo"]),
            registeredPlaces: Number(formState["Cupos matriculados"]),
            professors: professors
        } },{
            onSuccess: () => {
                setmessage(`Grupo ${groupId} actualizado correctamente`);
                setShowSuccess(true);
                onOpenChange();
                setUpdated(true);
                onResetForm();
                setTimeout(() => {
                    setShowSuccess(false);
                    setUpdated(false);
                }, 3000); 
                setSelectedKeys(new Set())
                
            },
            onError: () => {
                setmessage("Error al actualizar el grupo");
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 3000);
            },
        })
    }

    return (
        <>
            <CustomNotification message={message} type="success" show={showSuccess} />
            <CustomNotification message={message} type="error" show={showError} />
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                >
                <ModalContent>
                    {(onClose) => {
                        onCloseRef.current = onClose;
                        return (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Nueva Programación académica
                            </ModalHeader>
                            <ModalBody>
                                <Form onSubmit={handleSubmit}>
                                    {Object.entries(formState).map(([key, value]) => (
                                        <Input
                                            key={key}
                                            name={key}
                                            label={key}
                                            value={String(value)}
                                            labelPlacement="outside"
                                            onChange={onInputChange}
                                            isRequired
                                        />
                                    ))}

                                    <div className="flex justify-center my-4">
                                        <Button color="secondary"  onPress={ onOpenProfessor }>
                                            Modificar Profesores
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-4 items-center">
                                        <Button color="default" type="submit">
                                            Actualizar
                                        </Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                        );
                    }}
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenProfessor}
                onOpenChange={onOpenChangeProfessor}
            >
                <ModalContent>
                    {(onClose) => {
                        onCloseRef.current = onClose;
                        return (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Profesores
                            </ModalHeader>
                            <ModalBody>
                                <CustomDataGrid 
                                    data={ data || [] } 
                                    checkbox={true}
                                    selectedKeys={selectedKeys}
                                    onSelectionChange={handleSelectionChange}
                                    columns={[
                                        { field: 'id', headerName: 'ID'},
                                        { field: 'name', headerName: 'Nombre'},
                                        { field: 'identification', headerName: 'Identificacion' },
                                    ]}
                                />
                                
                                <div className="flex flex-wrap gap-4 items-center">
                                    <Button color="secondary" onPress={ onOpenChangeProfessor }>
                                        Regresar
                                    </Button>
                                </div>
                            </ModalBody>
                        </>
                        );
                    }}
                </ModalContent>
            </Modal>
        </>
    )
}