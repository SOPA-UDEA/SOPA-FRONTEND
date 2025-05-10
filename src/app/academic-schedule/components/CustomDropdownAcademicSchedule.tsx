'use client';

import { Menu } from '@headlessui/react';
import { Pensum } from '../../../interface/Pensum';
import { AcademicProgram } from '../../../interface/AcademicProgram';
import CustomDropdownButton from './CustomDropdownButton';
import CustomDropdownItems from './CustomDropdownItems';

type Props = {
  pensums: Pensum[];
  selectedPensum: Pensum[] | null;
  onSelect: (pensum: Pensum[]) => void;
  academicPrograms: AcademicProgram[];
  isLoading?: boolean;
};

export const  CustomDropdownAcademicSchedule = ({
  pensums,
  selectedPensum,
  onSelect,
  academicPrograms,
  isLoading = false,
}: Props) => {
  if (isLoading) return <div>Loading...</div>;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <CustomDropdownButton
        pensums={pensums}
        academicPrograms={academicPrograms}
      />
      <CustomDropdownItems
        pensums={pensums}
        academicPrograms={academicPrograms}
      />
    </Menu>
  );
};
