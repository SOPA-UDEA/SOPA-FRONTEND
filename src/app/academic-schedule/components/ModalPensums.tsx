import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import PesnumSelector from "./pensumsSelector";
import { ImportSelector } from "./ImportSelector";
import { ImportFile } from "./ImportFile";
interface Props {
    setPensums: (pensumsId: number[]) => void;
    text: string;
    onOpenSchedule: () => void;
    setAction: (a: string) => void;
    action: string;
    isFromDrai: boolean;
    setImportType: (type: "CREATE" | "UPDATE") => void;
    setFile: (file: File | null) => void;
}

export const ModalPensums = ({ setPensums, action, onOpenSchedule, text, setAction, isFromDrai, setImportType, setFile }: Props) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenImportSelector, onOpenChange: onOpenChangeImportSelector, onOpen: onOpenImportSelector } = useDisclosure();
    const { isOpen: isOpenImportFile, onOpenChange: onOpenChangeImportFile, onOpen: onOpenImportFile } = useDisclosure();



    return (
        <>
            {isFromDrai && (
                <Button
                    color="secondary"
                    onPress={() => { onOpenImportSelector() }}
                >
                    {text}
                </Button>
            )}
            {!isFromDrai && (
                <Button
                    color="secondary"
                    onPress={() => { onOpen() }}
                >
                    {text}
                </Button>
            )}

            <ImportSelector
                setImportType={setImportType}
                isOpen={isOpenImportSelector}
                onOpenChange={onOpenChangeImportSelector}
                openImportFile={onOpenImportFile}

            />

            <ImportFile setFile={setFile}
                isOpen={isOpenImportFile}
                onOpenChange={onOpenChangeImportFile}
                openModalPensums={onOpen}

            />

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {() => {
                        return (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Selecciona los Pensums
                                </ModalHeader>
                                <ModalBody>
                                    <PesnumSelector
                                        setSelectedPensumsIds={setPensums}
                                        onOpenChange={onOpenChange}
                                        onOpenSchedule={onOpenSchedule}
                                        setAction={setAction}
                                        action={action}
                                        isFromDrai={isFromDrai}
                                    />
                                </ModalBody>
                            </>
                        );
                    }}
                </ModalContent>
            </Modal>
        </>
    )
}
