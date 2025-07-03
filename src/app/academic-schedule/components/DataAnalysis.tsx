import { Button, Modal, ModalContent, useDisclosure } from "@heroui/react"
import { AnalysisPicker } from "./AnalysisPicker";
import { ModalAnalysis } from "./ModalAnalysis";
import { useState } from "react";

interface AnalysisProps {
    action: "ANALYSIS" | "EXPORT";
}

export const DataAnalysis = ({
    action,
}: AnalysisProps) => {
    const [isCollisionOnly, setIsCollisionOnly] = useState(false);

    const { isOpen: isOpenAnalysis, onOpenChange: onOpenChangeAnalysis, onOpen: onOpenAnalysis } = useDisclosure()
    const { isOpen: isOpenModalDataAnalysis, onOpenChange: onOpenChangeModalDataAnalysis, onOpen: onOpenModalDataAnalysis } = useDisclosure()
    const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);

    const handleNextModal = () => {
        if (action === "ANALYSIS") {
            onOpenAnalysis();
        } else {
            onOpenModalDataAnalysis();
        }
    }

    return (
        <>
            <Button onPress={handleNextModal} color="secondary">
                {action === "ANALYSIS" ? "Análisis de Datos" : "Exportar Programación Académica"}
            </Button>
            {action === "ANALYSIS" && (
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
            )}
            <ModalAnalysis
                isOpen={isOpenModalDataAnalysis}
                onOpenChange={onOpenChangeModalDataAnalysis}
                isCollisionOnly={isCollisionOnly}
                selectedAnalyses={selectedAnalyses}
                setSelectedAnalyses={setSelectedAnalyses}
                action={action}
            />
            
        </>
    );
}
