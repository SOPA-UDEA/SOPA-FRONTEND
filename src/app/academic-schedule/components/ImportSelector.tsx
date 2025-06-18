import { Button, ModalBody, Radio, RadioGroup, Tooltip } from "@heroui/react";
import { Modal, ModalContent } from "@heroui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

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

    const handleModal = (e: React.FormEvent) => {
        e.preventDefault();
        onOpenChange(false);
        openImportFile();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {() => (
                    <>
                        <ModalBody className="flex flex-col gap-6 px-6 py-4">
                            <h2 className="text-xl font-semibold text-gray-800">Selecciona el tipo de importación</h2>

                            <form onSubmit={handleModal} className="space-y-4">
                                <RadioGroup
                                    isRequired
                                    name="importType"
                                    onValueChange={(value) => setImportType(value as "CREATE" | "UPDATE")}
                                    className="flex flex-col gap-3"
                                >
                                    <div className="flex items-center justify-between gap-3 border rounded-md px-4 py-2 hover:bg-gray-50 transition">
                                        <Radio value="CREATE" className="flex-1 text-gray-700">
                                            Importar nueva programación
                                        </Radio>
                                        <Tooltip
                                            content={
                                                <div className="max-w-xs">
                                                    <div className="font-semibold mb-1">Importar nueva programación</div>
                                                    <div className="text-sm text-gray-700">
                                                        Se usa para definir los grupos con sus horarios, aulas y docentes
                                                        de la programación académica seleccionada. Los grupos
                                                        existentes no se verán afectados.
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <InformationCircleIcon className="w-5 h-5 text-amber-600 cursor-pointer" />
                                        </Tooltip>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 border rounded-md px-4 py-2 hover:bg-gray-50 transition">
                                        <Radio value="UPDATE" className="flex-1 text-gray-700">
                                            Actualizar programación
                                        </Radio>
                                        <Tooltip
                                            content={
                                                <div className="max-w-xs">
                                                    <div
                                                        className="font-semibold mb-1"
                                                    >
                                                        Actualizar programación
                                                    </div>
                                                    <div className="text-sm text-gray-700">
                                                        Se utiliza para cargar cambios reportados por el DRAI y
                                                        asignación de aulas a grupos que tienen aula pendiente. Para esto,
                                                        es necesario que ya exista la programación con los grupos y sus relaciones.
                                                    </div>

                                                </div>
                                            }
                                        >
                                            <InformationCircleIcon className="w-5 h-5 text-amber-600 cursor-pointer" />
                                        </Tooltip>
                                    </div>
                                </RadioGroup>

                                <div className="flex justify-end">
                                    <Button type="submit" color="secondary" className="w-full sm:w-40">
                                        Continuar
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
