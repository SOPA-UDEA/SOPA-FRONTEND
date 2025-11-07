"use client";

import { Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem, Button } from "@heroui/react";
import { useOwnedClassrooms, useValidateAssignClassroom, useAssignClassroom } from "@/hooks/useGroupClassroom";
import { useMemo, useState } from "react";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
  onUpdated: () => void;
}

export default function ModalUpdateClassroom({ isOpen, onOpenChange, groupId, onUpdated }: Props) {
  const { data: classrooms, isLoading } = useOwnedClassrooms();
  const { mutateAsync: validate } = useValidateAssignClassroom();
  const { mutateAsync: assign } = useAssignClassroom();
  const [selected, setSelected] = useState<number | null>(null);

  const options = useMemo(() => {
    return (classrooms ?? []).map(c => ({ id: c.id, label: c.location }));
  }, [classrooms]);

  const handleSave = async () => {
    if (!selected) return;
    const res = await validate({ groupId, classroomId: selected });
    if (res.conflicts && res.conflicts.length > 0) {
      return;
    }
    await assign({ groupId, classroomId: selected });
    onUpdated();
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Asignar aula</ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <Select
                label="Aula"
                selectedKeys={selected ? new Set([String(selected)]) : new Set([])}
                onChange={(e) => setSelected(parseInt((e.target as HTMLSelectElement).value))}
                isDisabled={isLoading}
              >
                {options.map(o => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.label}
                  </SelectItem>
                ))}
              </Select>
              <Button color="secondary" onPress={handleSave} isDisabled={!selected}>Guardar</Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
