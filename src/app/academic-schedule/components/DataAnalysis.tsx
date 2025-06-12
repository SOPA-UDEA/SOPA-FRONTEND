import { Button, Modal, ModalContent, useDisclosure } from "@heroui/react"
import { AnalysisPicker } from "./AnalysisPicker";
import { ModalAnalysis } from "./ModalAnalysis";
import { useState } from "react";

export const DataAnalysis = () => {
    const [isCollisionOnly, setIsCollisionOnly] = useState(false);

    const { isOpen: isOpenAnalysis, onOpenChange: onOpenChangeAnalysis, onOpen: onOpenAnalysis } = useDisclosure()
    const { isOpen: isOpenModalDataAnalysis, onOpenChange: onOpenChangeModalDataAnalysis, onOpen: onOpenModalDataAnalysis } = useDisclosure()
    const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);



    return (
        <>
            <Button onPress={onOpenAnalysis} color="secondary">
                Analítica de datos
            </Button>
            <Modal
                isOpen={isOpenAnalysis}
                onOpenChange={onOpenChangeAnalysis}
                className="overflow-y-auto"
            >
                <ModalContent>
                    {() => (
                        <AnalysisPicker
                            onOpenChangeModalDataAnalysis={onOpenChangeModalDataAnalysis}
                            setIsCollisionOnly={setIsCollisionOnly}
                            onOpenChange={onOpenChangeAnalysis}
                            selectedAnalyses={selectedAnalyses}
                            setSelectedAnalyses={setSelectedAnalyses}
                        />
                    )}
                </ModalContent>
            </Modal>
            <ModalAnalysis
                isOpen={isOpenModalDataAnalysis}
                onOpenChange={onOpenChangeModalDataAnalysis}
                isCollisionOnly={isCollisionOnly}
                selectedAnalyses={selectedAnalyses}
                setSelectedAnalyses={setSelectedAnalyses}
            />
        </>
    );
}
