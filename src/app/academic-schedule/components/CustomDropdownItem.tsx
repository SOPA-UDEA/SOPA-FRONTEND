import { MenuItem } from '@headlessui/react';
import { Pensum } from '../../../interface/Pensum';
import { AcademicProgram } from '../../../interface/AcademicProgram';
import { getAcademicProgramById } from '@/helpers/getAcademicProgramById';

type Props = {
  pensum: Pensum;
  academicPrograms: AcademicProgram[];
};

const CustomDropdownItem = ({ pensum, academicPrograms }: Props) => {
  const program = getAcademicProgramById(pensum.academicProgramId, academicPrograms);
  const label = `${program.name} - ${program.code} - ${program.modalityAcademic} - ${pensum.version}`;

  return (
    <MenuItem>
      {({ active }) => (
        <button
          // onClick={() => }
          // className={`${
          //   active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
          // } block w-full px-4 py-2 text-left text-sm`}
        >
          {label}
        </button>
      )}
    </MenuItem>
  );
};

export default CustomDropdownItem;