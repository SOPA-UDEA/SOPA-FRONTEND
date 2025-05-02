
'use client';
import React from 'react';
import ClassroomModal from './components/ClassroomsModal';

export default function ClassroomsPage() {

  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">This is just a example page</h1>

            {/*  classroom component here */}
            <ClassroomModal />

    </div>
  );
}