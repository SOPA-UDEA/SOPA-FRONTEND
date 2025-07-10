import { useAcademicProgram } from "@/app/academic-program/hooks/useAcademicProgram";
import { usePensums } from "@/hooks/usePensums";
import { getAcademicProgramById } from "@/helpers/getAcademicProgramById";
import {
  Button,
  Checkbox,
  Form,
  RadioGroup,
  Radio,
  CheckboxGroup,
} from "@heroui/react";
import { useState } from "react";

interface Props {
  setSelectedPensumsIds: (pensumsId: number[]) => void;
  onOpenChange: (isOpen: boolean) => void;
  onOpenSchedule: () => void;
  setAction: (a: string) => void;
  action: string;
  isFromDrai: boolean;
}

export default function PesnumSelector({
  setSelectedPensumsIds,
  onOpenChange,
  onOpenSchedule,
  setAction,
  action,
  isFromDrai,
}: Props) {
  const { pensums } = usePensums();
  const { academicPrograms, isLoading } = useAcademicProgram();
  const [selectedPensums, setSelectedPensums] = useState<number[]>([]);

  const handleCheckboxChange = (pensumId: number, checked: boolean) => {
    if (checked) {
      setSelectedPensums((prevSelected) => [...prevSelected, pensumId]);
    } else {
      setSelectedPensums((prevSelected) =>
        prevSelected.filter((id) => id !== pensumId)
      );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSelectedPensumsIds(selectedPensums);
    onOpenChange(false);
    onOpenSchedule();
    setAction(action);
  };

  if (isLoading) return <>Loading...</>;

  return (
    <Form onSubmit={handleSubmit}>
      {isFromDrai && (
        <RadioGroup
          isRequired
          name="pensums"
          onValueChange={(value) => setSelectedPensums([parseInt(value)])}
          className="mb-4">
          {pensums.map((pensum) => {
            const program = getAcademicProgramById(
              pensum.academicProgramId,
              academicPrograms
            );
            return (
              <Radio key={pensum.id} value={pensum.id.toString()}>
                {program.code} - {program.name} - {program.modalityAcademic} -{" "}
                {pensum.version}
              </Radio>
            );
          })}
        </RadioGroup>
      )}

      {!isFromDrai && (
        <CheckboxGroup
          className="flex flex-col gap-2"
          name="pensums"
          isRequired>
          {pensums.map((pensum) => {
            const program = getAcademicProgramById(
              pensum.academicProgramId,
              academicPrograms
            );
            return (
              <Checkbox
                key={pensum.id}
                value={pensum.id.toString()}
                defaultChecked={false}
                onChange={(e) =>
                  handleCheckboxChange(pensum.id, e.target.checked)
                }>
                {program.code} - {program.name} - {program.modalityAcademic} -{" "}
                {pensum.version}
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      )}

      <Button type="submit" color="secondary">
        Continuar
      </Button>
    </Form>
  );
}
