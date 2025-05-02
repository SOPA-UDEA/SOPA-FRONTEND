import React from 'react'
import { MenuItem } from '@headlessui/react'
import { Pensum } from '../../interface/Pensum';

export default function CustomDropdownItem  (pensum: Pensum)  {
  return (
   <MenuItem>
       <a
        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
        {pensum.version} 
        </a>
   </MenuItem>
  )
}
