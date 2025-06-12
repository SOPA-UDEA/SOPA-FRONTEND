import { Button, Modal, ModalBody, ModalContent, Input } from '@heroui/react'
import React from 'react'

interface ImportFileProps {
    setFile: (file: File | null) => void;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    openModalPensums: () => void;

}

export const ImportFile = ({
    setFile,
    isOpen,
    onOpenChange,
    openModalPensums
}: ImportFileProps) => {

    const handleModal = (e: React.FormEvent) => {
        e.preventDefault();
        onOpenChange(false);
        openModalPensums();

    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}

            >
                <ModalContent>
                    {() => {
                        return (
                            <>
                                <ModalBody className="flex flex-col gap-4">
                                    <h2 className="text-lg font-semibold">Importa el archivo</h2>
                                    <form onSubmit={(e) => { handleModal(e); }}>
                                        <Input
                                            isRequired
                                            type="file"
                                            accept=".xlsx, .xls, .csv"
                                            className="w-full"
                                            placeholder="Selecciona un archivo"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                setFile(file);
                                            }}
                                        ></Input>

                                        <Button
                                            className="mt-4 w-1/2"
                                            color="secondary"
                                            type='submit'                                        >
                                            Continuar
                                        </Button>

                                    </form>

                                </ModalBody>
                            </>
                        )
                    }}
                </ModalContent>
            </Modal>
        </>
    )
}
