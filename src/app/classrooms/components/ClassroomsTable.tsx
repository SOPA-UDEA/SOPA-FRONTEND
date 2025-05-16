import React, { useState, useEffect } from "react";
import {
  useClassrooms,
  useUpdateClassroom,
  useDeleteClassroom,
} from "@/hooks/useClassroom";
import { addToast, Button, Modal, ModalContent, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Chip } from "@heroui/react";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const columns = [
  { name: "ID", uid: "id" },
  { name: "Capacidad", uid: "capacity" },
  { name: "Ubicación", uid: "location" },
  { name: "Departamento", uid: "ownDepartment" },
  { name: "Virtual", uid: "virtualMode" },
  { name: "Acciones", uid: "actions" },
];

const statusColorMap = {
  true: "success",
  false: "danger",
};

export default function ClassroomManager() {
  const { data: classrooms, isLoading, error } = useClassrooms();
  const updateMutation = useUpdateClassroom();
  const deleteMutation = useDeleteClassroom();
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editCapacity, setEditCapacity] = useState<number>(0);
  const [editLocation, setEditLocation] = useState<string>("");
  const [editOwn, setEditOwn] = useState<boolean>(false);
  const [editVirtual, setEditVirtual] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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
          addToast({
            title: "Aula actualizada",
            description: "Aula actualizada correctamente",
            variant: "solid",
          });
          setEditing(false);
          setEditId(null);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          addToast({
            title: "Aula eliminada",
            description: "Aula eliminada correctamente",
            variant: "solid",
          });
          setDeleteId(null);
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "No se pudo eliminar el aula, pues esta estas asignada a un grupo",
            variant: "solid",
          });
        },
      });
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los datos</div>;

  return (
    <div className="p-6 space-y-6">
      <Table aria-label="Gestión de Aulas">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={classrooms}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.capacity}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>
                <Chip color={statusColorMap[item.ownDepartment]} size="sm" variant="flat">
                  {item.ownDepartment ? "Sí" : "No"}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip color={statusColorMap[item.virtualMode]} size="sm" variant="flat">
                  {item.virtualMode ? "Sí" : "No"}
                </Chip>
              </TableCell>
              <TableCell className="flex gap-2 justify-center">
                <Tooltip content="Editar">
                  <Button isIconOnly variant="light" onPress={() => handleEditClick(item.id)}>
                    <FaEdit size={20} />
                  </Button>
                </Tooltip>
                <Tooltip content="Eliminar">
                  <Button isIconOnly variant="light" onPress={() => handleDelete(item.id)}>
                    <MdDeleteForever size={20} />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editing && (
        <Modal isOpen={editing} hideCloseButton>
          <ModalContent>
            <div className="p-6 bg-white rounded-lg shadow-lg space-y-4">
              <h3 className="text-lg font-bold">Editar Aula {editId}</h3>
              <input type="number" value={editCapacity} onChange={(e) => setEditCapacity(Number(e.target.value))} className="border p-2 rounded w-full" />
              <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="border p-2 rounded w-full" />
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={editOwn} onChange={(e) => setEditOwn(e.target.checked)} /> Departamento
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={editVirtual} onChange={(e) => setEditVirtual(e.target.checked)} /> Virtual
              </label>
              <div className="flex gap-2 justify-end">
                <Button variant="flat" onPress={() => setEditing(false)}>Cancelar</Button>
                <Button onPress={handleUpdate}>Guardar</Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}

      {deleteId !== null && (
        <Modal isOpen={deleteId !== null} hideCloseButton>
          <ModalContent>
            <div className="p-6 bg-white rounded-lg shadow-lg space-y-4">
              <h3 className="text-lg font-bold">¿Estás seguro de eliminar esta aula?</h3>
              <div className="flex gap-2 justify-end">
                <Button variant="flat" onPress={() => setDeleteId(null)}>Cancelar</Button>
                <Button variant="solid" color="danger" onPress={confirmDelete}>Eliminar</Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
