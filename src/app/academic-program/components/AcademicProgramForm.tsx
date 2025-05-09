import { useForm } from "@/hooks/useForm";
import { CustomNotification } from "@/components/util/CustomNotification";
import { useCreateAcademicSchedule } from "@/hooks/useAcademicScheduleCreate";
import { Form, Input } from "@heroui/react"
import { Button, Modal, ModalBody, ModalHeader,  ModalContent, useDisclosure } from '@heroui/react'
import { useEffect, useRef, useState } from "react";
import { AcademicSchedule, AcademicScheduleResponse } from "@/interface/AcademicSchedule";

interface AcademicProgramFormProps {
    onCreated: (schedule: AcademicScheduleResponse) => void;
  }

export const AcademicProgramForm = ({ onCreated }: AcademicProgramFormProps) => {

    const { onInputChange, onResetForm, semester } = useForm( {
        semester: '',
    } );
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const onCloseRef = useRef<() => void>(() => {});
    const { mutate, isSuccess, isError, error } = useCreateAcademicSchedule();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        mutate(
            { semester },
            {
              onSuccess: (data) => {
                setShowSuccess(true);
                onResetForm();
                onCloseRef.current?.(); 
                onCreated(data);
              },

              onError: () => {
                setShowError(true);
              },
            }
          );
    };
    
    useEffect(() => {
        if (isSuccess) {
          onResetForm();    
        }
      }, [isSuccess]);


  return (
    <>
        <CustomNotification message="Programación creada con éxito" type="success" show={showSuccess} />
        <CustomNotification message="Error al crear la programación" type="error" show={showError} />
        <Button 
                onPress={onOpen}
            >
                Crear Programación
        </Button>

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
                            <Input
                            isRequired
                            name="semester"
                            label="Semestre académico"
                            labelPlacement="outside"
                            value={semester}
                            onChange={onInputChange}
                            validate={(value) => {
                                if (value.length < 6) {
                                return "semester must be at least 6 characters long";
                                }
                            }}
                            />
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

