"use client";
import React, { useState, useEffect } from "react";
import {
  useClassrooms,
  useCreateClassroom,
  useUploadClassrooms,
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
  const createMutation = useCreateClassroom();
  const uploadMutation = useUploadClassrooms();
  const updateMutation = useUpdateClassroom();
  const deleteMutation = useDeleteClassroom();

  // State for new classroom form
  const [newCapacity, setNewCapacity] = useState(0);
  const [newLocation, setNewLocation] = useState("");
  const [newOwn, setNewOwn] = useState(false);
  const [newVirtual, setNewVirtual] = useState(false);

  // State for editing
  const [editing, setEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editCapacity, setEditCapacity] = useState<number>(0);
  const [editLocation, setEditLocation] = useState<string>("");
  const [editOwn, setEditOwn] = useState<boolean>(false);
  const [editVirtual, setEditVirtual] = useState<boolean>(false);

  // State for file upload
  const [file, setFile] = useState<File | null>(null);

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

  const handleCreate = () => {
    createMutation.mutate(
      {
        capacity: newCapacity,
        location: newLocation,
        ownDepartment: newOwn,
        virtualMode: newVirtual,
      },
      {
        onSuccess: () => {
          addToast({
            title: "Aula creada",
            description: "Aula creada correctamente",
            variant: "solid",
          });
          setNewCapacity(0);
          setNewLocation("");
          setNewOwn(false);
          setNewVirtual(false);
        },
      }
    );
  };

  const handleUpload = () => {
    if (!file) {
      alert("Selecciona un archivo primero");
      return;
    }
    uploadMutation.mutate(file, {
      onSuccess: () => {
        alert("Archivo subido correctamente");
        addToast({
          title: "Archivo subido",
          description: "Archivo subido correctamente",
          variant: "solid",
        });
        setFile(null);
      },
    });
  };

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
      {/* Create new classroom form */}
      <div className="border p-4 rounded-lg shadow-sm">
        <h2 className="text-xl mb-2">Crear nueva aula</h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="number"
            placeholder="Capacidad"
            value={newCapacity}
            onChange={(e) => setNewCapacity(Number(e.target.value))}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Ubicación"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className="border p-2 rounded"
          />
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={newOwn}
              onChange={(e) => setNewOwn(e.target.checked)}
            />{" "}
            Departamento
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={newVirtual}
              onChange={(e) => setNewVirtual(e.target.checked)}
            />{" "}
            Virtual
          </label>
          <Button onPress={handleCreate}>Crear</Button>
        </div>
      </div>

      {/* Upload Excel file */}
      <div className="border p-4 rounded-lg shadow-sm">
        <h2 className="text-xl mb-2">Subir aulas desde Excel</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button onPress={handleUpload} disabled={!file}>
          Subir
        </Button>
      </div>

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
