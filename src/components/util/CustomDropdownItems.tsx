import { MenuItems } from '@headlessui/react';
import { Pensum } from '../../interface/Pensum';
import { AcademicProgram } from '../../interface/AcademicProgram';
import CustomDropdownItem from './CustomDropdownItem';

type Props = {
  pensums: Pensum[];
  onSelect: (pensum: Pensum) => void;
  academicPrograms: AcademicProgram[];
};

const CustomDropdownItems = ({ pensums, onSelect, academicPrograms }: Props) => {
  return (
    <MenuItems className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5">
      <div className="py-1">
        {pensums.map((pensum) => (
          <CustomDropdownItem
            key={pensum.id}
            pensum={pensum}
            onSelect={onSelect}
            academicPrograms={academicPrograms}
          />
        ))}
      </div>
    </MenuItems>
  );
};

export default CustomDropdownItems;