import {Pensum} from '@/interface/Pensum';
import {AcademicProgram} from '@/interface/AcademicProgram';
import { getAcademicProgram } from '@/services/academicProgramService';
import { getAcademicProgramById } from '@/helpers/getAcademicProgramById';
import { Menu } from '@heroui/react';
import { MenuButton } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {Checkbox} from "@heroui/checkbox";

type Props = {
    pensums: Pensum[] | null;
    academicPrograms: AcademicProgram[];
};

const CustomDropdownButton = ({ academicPrograms, pensums }: Props) => {

        // ? (() => {
        //     const program = getAcademicProgramById(, academicPrograms);
        //     return `${program.name} - ${program.code} - ${program.modalityAcademic} - ${selectedPensum.version}`;
        // })()
        // : 'Selecciona un pensum';

    return (
        <MenuButton className="inline-flex w-[400px] justify-center gap-x-1.5 rounded-md bg-brand px-3 py-2 text-sm font-semibold shadow-xs ring-1 ring-gray-300 ring-inset hover:opacity-90">
             <Checkbox defaultSelected={false}>opcion 1</Checkbox> 
            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-white"/>
        </MenuButton>
    );
};

export default CustomDropdownButton;


