import {
  Checkbox,
  CheckboxGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  ModalContent,
} from "@heroui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@heroui/react";
import { useEffect } from "react";

interface AnalysisPickerProps {
  onOpenChangeModalDataAnalysis: (isOpen: boolean) => void;
  setIsCollisionOnly: (isCollisionOnly: boolean) => void;
  onOpenChange: (isOpen: boolean) => void;
  selectedAnalyses: string[];
  setSelectedAnalyses: (analyses: string[]) => void;
}

export const AnalysisPicker = ({
  onOpenChangeModalDataAnalysis,
  setIsCollisionOnly,
  onOpenChange,
  selectedAnalyses,
  setSelectedAnalyses,
}: AnalysisPickerProps) => {
  useEffect(() => {
    if (selectedAnalyses.length === 1 && selectedAnalyses[0] === "collision") {
      setIsCollisionOnly(true);
    } else {
      setIsCollisionOnly(false);
    }
  }, [selectedAnalyses, setIsCollisionOnly]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onOpenChange(false); // Close the analysis picker modal
    onOpenChangeModalDataAnalysis(true);

    console.log("selected with state:", selectedAnalyses);
  };

  return (
    <>
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              Seleccione los análisis que desea ejecutar
            </ModalHeader>
            <ModalBody>
              <CheckboxGroup
                className="flex flex-col gap-4"
                name="analyses"
                isRequired
                onChange={(values: string[]) => setSelectedAnalyses(values)}>
                {[
                  {
                    value: "collision",
                    label: "Análisis de Colisiones",
                    tooltipTitle: "Colisiones",
                    tooltipDescription:
                      "Este análisis detecta superposiciones de horarios y aulas entre los grupos programados.",
                  },
                  {
                    value: "mirrorGroup",
                    label: "Análisis de Grupos Espejo",
                    tooltipTitle: "Grupos Espejo",
                    tooltipDescription:
                      "Este análisis verifica que los grupos espejo coincidan en horarios y aulas según la información del DRAI. " +
                      "Requiere actualización previa desde el DRAI.",
                  },
                  {
                    value: "classroomSchedule",
                    label: "Análisis de Horarios y Aulas",
                    tooltipTitle: "Horarios y Aulas",
                    tooltipDescription:
                      "Valida que los horarios y aulas estén correctamente asignados, contrastando con la información del DRAI. " +
                      "Requiere actualización previa desde el DRAI.",
                  },
                  {
                    value: "capacity",
                    label: "Análisis de Capacidad",
                    tooltipTitle: "Capacidad",
                    tooltipDescription:
                      "Verifica si la capacidad de las aulas es adecuada para los grupos asignados, identificando posibles sobrecupos.",
                  },
                ].map(({ value, label, tooltipTitle, tooltipDescription }) => (
                  <div key={value} className="flex items-start gap-2">
                    <Checkbox value={value} className="flex-1">
                      {label}
                    </Checkbox>
                    <Tooltip
                      content={
                        <div className="max-w-xs">
                          <div className="font-semibold">{tooltipTitle}</div>
                          <div className="text-sm text-gray-700">
                            {tooltipDescription}
                          </div>
                        </div>
                      }
                      placement="right">
                      <InformationCircleIcon className="w-5 h-5 text-amber-700 mt-1 cursor-pointer" />
                    </Tooltip>
                  </div>
                ))}
              </CheckboxGroup>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <Button color="secondary" type="submit">
                Continuar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </>
  );
};
