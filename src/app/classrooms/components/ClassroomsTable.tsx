import React, { useState, useEffect } from "react";
import {
  useClassrooms,
  useUpdateClassroom,
  useDeleteClassroom,
  useChangeClassroomStatus,
} from "@/hooks/useClassroom";
import {
  addToast,
  Button,
  Modal,
  ModalContent,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
  Switch,
} from "@heroui/react";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Classroom } from "@/interface/Classroom";
import { isClassroomInUse } from "@/services/classroom";

const columns = [
  { name: "ID", uid: "id" },
  { name: "Capacidad", uid: "capacity" },
  { name: "Aula", uid: "location" },
  { name: "Departamento", uid: "ownDepartment" },
  { name: "Virtual", uid: "virtualMode" },
  { name: "Estado", uid: "enabled" },
  { name: "Acciones", uid: "actions" },
];

const statusColorMap = {
  true: "success",
  false: "danger",
};
export async function checkIfClassroomInUse(classroomId: number): Promise<{ in_use: boolean }> {
  return isClassroomInUse(classroomId);
}

export default function ClassroomManager() {
  const { data: classrooms, isLoading, error } = useClassrooms();
  const updateMutation = useUpdateClassroom();
  const deleteMutation = useDeleteClassroom();
  const changeStatusMutation = useChangeClassroomStatus();

  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editCapacity, setEditCapacity] = useState<number>(0);
  const [editLocation, setEditLocation] = useState<string>("");
  const [editOwn, setEditOwn] = useState<boolean>(false);
  const [editVirtual, setEditVirtual] = useState<boolean>(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [cannotDeleteModal, setCannotDeleteModal] = useState(false);
  const [targetClassroom, setTargetClassroom] = useState<Classroom | null>(
    null
  );
  const [editEnabled, setEditEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (editing && editId !== null && classrooms) {
      const room = classrooms.find((c) => c.id === editId);
      if (room) {
        setEditCapacity(room.capacity);
        setEditLocation(room.location);
        setEditOwn(room.ownDepartment);
        setEditVirtual(room.virtualMode);
        setEditEnabled(room.enabled);
      }
    }
  }, [editing, editId, classrooms]);

  useEffect(() => {
    if (targetClassroom) {
      setEditEnabled(targetClassroom.enabled);
    }
  }, [targetClassroom]);

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
          enabled: editEnabled,
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

const handleDelete = async (id: number) => {
  const classroom = classrooms.find((c) => c.id === id);
  if (!classroom) return;

  const { in_use } = await checkIfClassroomInUse(classroom.id);

  if (in_use) {
    setTargetClassroom(classroom);
    setCannotDeleteModal(true);
  } else {
    setDeleteId(id); // muestra el modal de confirmación
  }
};



const confirmDelete = async () => {
  if (deleteId === null) return;

  const classroom = classrooms.find((c) => c.id === deleteId);
  if (!classroom) return;

  const { in_use } = await checkIfClassroomInUse(classroom.id);

  if (in_use) {
    setTargetClassroom(classroom);
    setCannotDeleteModal(true);
    setDeleteId(null);
  } else {
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
          title: "Error al eliminar aula",
          description: "No se pudo eliminar el aula. Inténtalo de nuevo.",
          variant: "solid",
        });
        setDeleteId(null);
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
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
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
                <Chip
                  color={statusColorMap[item.ownDepartment]}
                  size="sm"
                  variant="flat"
                >
                  {item.ownDepartment ? "Sí" : "No"}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip
                  color={statusColorMap[item.virtualMode]}
                  size="sm"
                  variant="flat"
                >
                  {item.virtualMode ? "Sí" : "No"}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip
                  color={statusColorMap[item.enabled]}
                  size="sm"
                  variant="flat"
                >
                  {item.enabled ? "Habilitado" : "Deshabilitado"}
                </Chip>
              </TableCell>
              <TableCell className="flex gap-2 justify-center">
                <Tooltip content="Editar">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleEditClick(item.id)}
                  >
                    <FaEdit size={20} />
                  </Button>
                </Tooltip>
                <Tooltip content="Eliminar">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleDelete(item.id)}
                  >
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

      {deleteId !== null && (
        <Modal isOpen={deleteId !== null} hideCloseButton>
          <ModalContent>
            <div className="p-6 bg-white rounded-lg shadow-lg space-y-4">
              <h3 className="text-lg font-bold">
                ¿Estás seguro de eliminar esta aula?
              </h3>
              <div className="flex gap-2 justify-end">
                <Button variant="flat" onPress={() => setDeleteId(null)}>
                  Cancelar
                </Button>
                <Button variant="solid" color="danger" onPress={confirmDelete}>
                  Eliminar
                </Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
      {cannotDeleteModal && targetClassroom && (
        <Modal
          isOpen={cannotDeleteModal}
          onClose={() => setCannotDeleteModal(false)}
        >
          <ModalContent>
            <div className="p-6 bg-white rounded-lg shadow-lg space-y-4">
              <h3 className="text-lg font-bold">
                No se puede eliminar el aula
              </h3>
              <p>
                Esta aula está asignada a un grupo activo y no puede ser
                eliminada directamente.
              </p>

              <div className="flex items-center gap-2">
                <span className="font-medium">Estado actual:</span>
                <span
                  className={`px-2 py-1 text-sm rounded-full text-white ${
                    targetClassroom.enabled ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {targetClassroom.enabled ? "Habilitada" : "Deshabilitada"}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <label className="font-medium">
                  ¿Te gustaría cambiar el estado del aula?
                </label>
                <Switch
                  isSelected={!editEnabled}
                  onChange={() => setEditEnabled((prev) => !prev)}
                  isDisabled={changeStatusMutation.isLoading}
                />
              </div>

              <div className="flex justify-end pt-4 gap-2">
                {editEnabled !== targetClassroom.enabled ? (
                  <Button
                    variant="solid"
                    className={
                      editEnabled
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                    isDisabled={changeStatusMutation.isLoading}
                    onPress={() => {
                      if (targetClassroom) {
                        console.log(
                          "Aplicando cambios con estado:",
                          editEnabled
                        );
                        changeStatusMutation.mutate({
                          classroomId: targetClassroom.id,
                          enabled: editEnabled,
                        });
                        setCannotDeleteModal(false);
                      }
                    }}
                  >
                    {editEnabled ? "Habilitar" : "Deshabilitar"}
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">
                    No hay cambios en el estado.
                  </p>
                )}

                <Button
                  variant="ghost"
                  onPress={() => setCannotDeleteModal(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
