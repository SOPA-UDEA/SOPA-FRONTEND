"use client";
import React from "react";
// import ClassroomModal from "./components/ClassroomsModal";
import CreateClassroombutton from "./components/CreateClassroomButton"
import ClassroomTable from "./components/ClassroomsTable";

export default function ClassroomsPage() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl font-bold w-full text-center">
        Gestión de Aulas
      </h1>

      {/*  classroom component here */}
      {/* <ClassroomModal /> */}
      {/* Classroom creator component */}
      <CreateClassroombutton />
      <ClassroomTable />
    </div>
  );
}
