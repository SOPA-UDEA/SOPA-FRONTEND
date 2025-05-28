import { useForm } from "@/hooks/useForm";
import { CustomNotification } from "@/components/util/CustomNotification";
import { Form, Input } from "@heroui/react"
import { Button, Modal, ModalBody, ModalHeader,  ModalContent, useDisclosure } from '@heroui/react'
import { useEffect, useRef, useState } from "react";
import { UseMutationResult } from "@tanstack/react-query";

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
        <Button
        onPress={onOpen}
        
        className="capitalize min-w-[200px] md:min-w-[250px] justify-start text-left /* Ancho y alineación */
                   border border-neutral-50 hover:border-primary-361                /* Borde y hover del borde */
                   text-primary-7740                                                 /* Color del texto (tu verde) */
                   dark:border-neutral-500/50 dark:hover:border-primary-361
                   dark:text-primary-361                                             /* Color de texto en modo oscuro */
                   bg-neutral-100 dark:bg-neutral-1000                                /* Fondo blanco/oscuro */
                   hover:bg-primary-361/5 dark:hover:bg-primary-361/10              /* Fondo sutil en hover (opacidad más baja) */
                   focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-361 focus:ring-offset-background /* Estilos de foco */
                   px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-150 mb-6" 
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
