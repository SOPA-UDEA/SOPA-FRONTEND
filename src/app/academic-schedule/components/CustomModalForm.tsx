import { useForm } from "@/hooks/useForm";
import { CustomNotification } from "@/components/util/CustomNotification";
import { Form, Input } from "@heroui/react"
import { Button, Modal, ModalBody, ModalHeader,  ModalContent, useDisclosure } from '@heroui/react'
import { useEffect, useRef, useState } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import CustomDropdownButton from "@/app/pensum/components/CustomDropdownButton";
import CustomButton from "@/components/util/CustomButton";

interface FormProps<T> {
  onSubmitForm: UseMutationResult<T, unknown, any, unknown>;
  defaultValues?: Record<string, any>;
  onCreated: (data: any) => void;
}

export const CustomModalForm = <T,>({ onCreated, defaultValues, onSubmitForm }: FormProps<T>) => {
    const initialFormState = defaultValues || {};
    const {formState, onInputChange, onResetForm, } = useForm(initialFormState);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const onCloseRef = useRef<() => void>(() => {});
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    
    
    

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmitForm.mutate( formState ,
            {
              onSuccess: (data) => {
                setShowSuccess(true);
                onResetForm();
                onCloseRef.current?.(); 
                onCreated(data);
                onOpenChange();
              },
              onError: () => {
                setShowError(true);
                onOpenChange();
              },
            }

            
        )
    };
    
    useEffect(() => {
        if (onSubmitForm.isSuccess) {
          onResetForm();    
        }
      }, [onSubmitForm.isSuccess]);

  return (
    <>
        <CustomNotification message="Programación creada con éxito" type="success" show={showSuccess} />
        <CustomNotification message="Error al crear la programación" type="error" show={showError} />
        <CustomButton onPress={() => {onOpen()}}>
          Crear Programación
        </CustomButton>

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
                                value={value}
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
