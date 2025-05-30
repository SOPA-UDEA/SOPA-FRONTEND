import { CustomNotification } from "@/components/util/CustomNotification";
import { useForm } from "@/hooks/useForm";
import { useUpdateGroupById } from "@/hooks/useGroups";
import { Group, GroupRequestUpdate } from "@/interface/Group";
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedGroup: GroupRequestUpdate;
    groupId: number;
}

export default function CustomModalUpdate({ isOpen, onOpenChange, selectedGroup, groupId}: Props) {
    const initialFormState = {
        groupSize: selectedGroup.groupSize,
        modality: selectedGroup.modality,
        maxSize: selectedGroup.maxSize,
        registeredPlaces: selectedGroup.registeredPlaces,
    };
    const {formState, onInputChange, onResetForm, } = useForm(initialFormState);
    const { mutateAsync } = useUpdateGroupById();

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [message, setmessage] = useState("");

    const onCloseRef = useRef<() => void>(() => {});  
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        mutateAsync({ groupId: groupId, group: {
            groupSize: Number(formState.groupSize),
            modality: formState.modality,
            maxSize: Number(formState.maxSize),
            registeredPlaces: Number(formState.registeredPlaces),
        } },{
            onSuccess: () => {
                onCloseRef.current?.(); 
                setmessage(`Grupo ${groupId} actualizado correctamente`);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000); 
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

    useEffect(() => {
        if (!isOpen) {
            onResetForm(); 
        }
    }, [isOpen]);

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
                               
                                <div className="flex flex-wrap gap-4 items-center">
                                <Button color="default" type="submit">
                                    Crear
                                </Button>
                                <Button
                                    color="warning"
                                    type="button"
                                    onPress={onResetForm}
                                    className="bg-red-500 text-white"
                                >
                                    Borrar
                                </Button>
                                </div>
                            </Form>
                            </ModalBody>
                        </>
                        );
                    }}
                </ModalContent>
            </Modal>
        </>
    )
}