import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Pensum } from '@/app/interface/Pensum';
import { useState } from 'react'
import { useFetchAcademicProgram } from '@/app/hooks/useFetchAcademicProgram';
import { getAcademicProgramById } from '@/app/helpers/getAcademicProgramById';


export default function CustomDropdown({
  pensums,
  selectedPensum,
  onSelect,
}: {
  pensums: Pensum[],
  selectedPensum: Pensum | null,
  onSelect: (pensum: Pensum) => void
}) {
  const { academicPrograms, loading } = useFetchAcademicProgram()

  if (loading) return <div>Loading...</div>

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-[400px] justify-center gap-x-1.5 rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white shadow-xs ring-1 ring-gray-300 ring-inset hover:opacity-90">
          {selectedPensum
            ? (() => {
                const program = getAcademicProgramById(selectedPensum.academicProgramId, academicPrograms);
                return `${program.name} - ${program.code} - ${program.modalityAcademic} - ${selectedPensum.version}`;
              })()
            : 'Selecciona un pensum'}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-white" />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5">
        <div className="py-1">
          {pensums.map((pensum) => {
            const program = getAcademicProgramById(pensum.academicProgramId, academicPrograms);
            return (
              <MenuItem key={pensum.id}>
                {({ active }) => (
                  <button
                    onClick={() => onSelect(pensum)}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full px-4 py-2 text-left text-sm`}
                  >
                    {program.name} - {program.code} - {program.modalityAcademic} - {pensum.version}
                  </button>
                )}
              </MenuItem>
            );
          })}
        </div>
      </MenuItems>
    </Menu>
  );
}

  