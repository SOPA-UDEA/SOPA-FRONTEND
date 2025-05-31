"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button
} from "@heroui/react"; 
import { Pensum } from '../../../interface/Pensum';
import { AcademicProgram } from '../../../interface/AcademicProgram';

interface CustomDropdownProps {
  pensums: Pensum[];
  selectedPensum: Pensum | null;
  onSelect: (pensum: Pensum | null) => void;
  academicPrograms: AcademicProgram[];
  ariaLabel?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  pensums,
  selectedPensum,
  onSelect,
  academicPrograms,
  ariaLabel = "Seleccionar Pensum"
}) => {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(selectedPensum ? [String(selectedPensum.id)] : [])
  );

  useEffect(() => {
    if (selectedPensum) {
      setSelectedKeys(new Set([String(selectedPensum.id)]));
    } else {
      setSelectedKeys(new Set());
    }
  }, [selectedPensum]);

  const handleSelectionChange = (keys: any) => {
    const newSelectedKey = Array.from(keys as Set<string>)[0];
    setSelectedKeys(new Set([newSelectedKey]));
    const newPensum = pensums.find(p => String(p.id) === newSelectedKey) || null;
    onSelect(newPensum);
  };

  const selectedValueText = useMemo(() => {
    if (!selectedPensum) {
      return "Seleccione un pensum";
    }
    const program = academicPrograms.find(ap => ap.id === selectedPensum.academicProgramId);
    if (program) {
      return `${program.name} - ${program.modalityAcademic} - ${selectedPensum.version || `Plan ${selectedPensum.id}`}`;
    }
    return `Pensum ID: ${selectedPensum.id} - Versión: ${selectedPensum.version || 'N/A'}`;
  }, [selectedPensum, academicPrograms]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button

          className="capitalize min-w-[300px] w-full md:w-auto justify-between 
                     bg-neutral-100 dark:bg-neutral-1000                     /* Fondo blanco/oscuro */
                     text-primary-foreground dark:text-neutral-100          /* Texto principal */
                     border border-neutral-50 dark:border-neutral-500/50    /* Borde sutil */
                     hover:bg-neutral-10 dark:hover:bg-neutral-500/20       /* Efecto hover */
                     focus:outline-none focus:ring-2 focus:ring-primary-361 focus:ring-opacity-50 /* Estilos de foco */
                     px-4 py-2 rounded-md shadow-sm" 
        >
          {selectedValueText}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={ariaLabel}
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        items={pensums}
      >
        {(item) => {
          const program = academicPrograms.find(ap => ap.id === item.academicProgramId);
          const itemLabel = program
            ? `${program.name} - ${program.modalityAcademic} - ${item.version || `Plan ${item.id}`}`
            : `Pensum ID: ${item.id} - Versión: ${item.version || 'N/A'}`;
          return (
            <DropdownItem key={String(item.id)}>
              {itemLabel}
            </DropdownItem>
          );
        }}
      </DropdownMenu>
    </Dropdown>
  );
};

export default CustomDropdown;