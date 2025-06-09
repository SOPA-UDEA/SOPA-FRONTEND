import { Button, ModalBody, Radio, RadioGroup } from "@heroui/react";
import { Modal, ModalContent } from "@heroui/react";

interface ImportSelectorProps {
    setImportType: (type: "CREATE" | "UPDATE") => void;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    openImportFile: () => void;
}

export const ImportSelector = ({
    setImportType,
    isOpen,
    onOpenChange,
    openImportFile
}: ImportSelectorProps) => {

    const handlemodal = (e: React.FormEvent) => {
        e.preventDefault();
        onOpenChange(false);
        openImportFile();
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
                                    <h2 className="text-lg font-semibold">Selecciona el tipo de importación</h2>
                                    <form onSubmit={(e) => {
                                        handlemodal(e);}}>
                                    <RadioGroup
                                        isRequired
                                        name="importType"
                                        onValueChange={(value) => setImportType(value as "CREATE" | "UPDATE")}
                                        className="flex flex-col gap-2"
                                    >
                                        <Radio value="CREATE">Importar nueva programación</Radio>
                                        <Radio value="UPDATE">Actualizar programación</Radio>
                                    </RadioGroup>
                                    <Button
                                        className="mt-4 w-1/2"
                                        type="submit"
                                        color="secondary"
                                    >
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
