"use client";
import React, { useState, useEffect } from "react";
import {
  useClassrooms,
  useUpdateClassroom,
  useDeleteClassroom,
} from "@/hooks/useClassroom";
import { addToast, Button, Modal, ModalContent } from "@heroui/react";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

// Column definitions for table header
const columns = [
  { name: "ID", uid: "id" },
  { name: "Capacidad", uid: "capacity" },
  { name: "Ubicación", uid: "location" },
  { name: "Departamento", uid: "ownDepartment" },
  { name: "Virtual", uid: "virtualMode" },
  { name: "Acciones", uid: "actions" },
];

export default function ClassroomManager() {
  const { data: classrooms, isLoading, error } = useClassrooms();
  const updateMutation = useUpdateClassroom();
  const deleteMutation = useDeleteClassroom();

  // State for editing
  const [editing, setEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editCapacity, setEditCapacity] = useState<number>(0);
  const [editLocation, setEditLocation] = useState<string>("");
  const [editOwn, setEditOwn] = useState<boolean>(false);
  const [editVirtual, setEditVirtual] = useState<boolean>(false);


  // Populate edit form when selecting a classroom
  useEffect(() => {
    if (editing && editId !== null && classrooms) {
      const room = classrooms.find((c) => c.id === editId);
      if (room) {
        setEditCapacity(room.capacity);
        setEditLocation(room.location);
        setEditOwn(room.ownDepartment);
        setEditVirtual(room.virtualMode);
      }
    }
  }, [editing, editId, classrooms]);

  const handleEditClick = (id: number) => {
    setEditId(id);
    setEditing(true);
  };

  const handleUpdate = () => {
    if (editId === null) return;
    updateMutation.mutate(
      {
        classroomId: editId,
        classroom: {
          capacity: editCapacity,
          location: editLocation,
          ownDepartment: editOwn,
          virtualMode: editVirtual,
        },
      },
      {
        onSuccess: () => {
          alert("Aula actualizada correctamente");
          setEditing(false);
          setEditId(null);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta aula?")) {
      deleteMutation.mutate(id, {
        onSuccess: () =>
          addToast({
            title: "Aula eliminada",
            description: "Aula eliminada correctamente",
            variant: "solid",
          }),
      });
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los datos</div>;

  return (
    <div className="p-4 space-y-6">

      {/* Classroom table */}
      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.uid} className="border px-4 py-2 text-center">
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {classrooms?.map((room) => (
            <tr key={room.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-center">{room.id}</td>
              <td className="border px-4 py-2 text-center">{room.capacity}</td>
              <td className="border px-4 py-2 text-center">{room.location}</td>
              <td className="border px-4 py-2 text-center">
                {room.ownDepartment ? "Sí" : "No"}
              </td>
              <td className="border px-4 py-2 text-center">
                {room.virtualMode ? "Sí" : "No"}
              </td>
              <td className="border px-4 py-2 flex gap-2 justify-center">
                <Button
                  isIconOnly
                  variant="ghost"
                  onPress={() => handleEditClick(room.id!)}>
                  <FaEdit size={20} />
                </Button>
                <Button
                  isIconOnly
                  variant="ghost"
                  onPress={() => handleDelete(room.id!)}>
                  <MdDeleteForever size={20} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit modal */}
      {editing && (
        <Modal isOpen={editing} hideCloseButton>
          <ModalContent>
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
              <h3 className="text-lg">Editar aula {editId}</h3>
              <input
                type="number"
                value={editCapacity}
                onChange={(e) => setEditCapacity(Number(e.target.value))}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={editOwn}
                  onChange={(e) => setEditOwn(e.target.checked)}
                />{" "}
                Departamento
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={editVirtual}
                  onChange={(e) => setEditVirtual(e.target.checked)}
                />{" "}
                Virtual
              </label>
              <div className="flex gap-2 justify-end">
                <Button variant="flat" onPress={() => setEditing(false)}>
                  Cancelar
                </Button>
                <Button onPress={handleUpdate}>Guardar</Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
