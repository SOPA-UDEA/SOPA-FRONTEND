import React, { useState } from "react";
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
  RadioGroup,
  ModalBody,
  ModalHeader,
  Radio,
  Input,
  InputOtp,
  ModalFooter,
} from "@heroui/react";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Classroom, UpdateClassroomDTO } from "@/interface/Classroom";
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
export async function checkIfClassroomInUse(
  classroomId: number
): Promise<{ in_use: boolean }> {
  return isClassroomInUse(classroomId);
}

export default function ClassroomManager() {
  const { data: classrooms, isLoading, error } = useClassrooms();
  const updateMutation = useUpdateClassroom();
  const deleteMutation = useDeleteClassroom();
  const changeStatusMutation = useChangeClassroomStatus();

  const [editing, setEditing] = useState(false);
  const [editCapacity, setEditCapacity] = useState("");
  const [editVirtual, setEditVirtual] = useState(false);
  const [editPlatform, setEditPlatform] = useState("");
  const [editOwn, setEditOwn] = useState(false);
  const [editBlock, setEditBlock] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editRoom, setEditRoom] = useState("");
  const [editClassroomValue, setEditClassroomValue] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [cannotDeleteModal, setCannotDeleteModal] = useState(false);
  const [targetClassroom, setTargetClassroom] = useState<Classroom | null>(
    null
  );
  const [editEnabled, setEditEnabled] = useState<boolean>(true);

  const openEditModal = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setEditCapacity(String(classroom.capacity));
    setEditVirtual(classroom.virtualMode);
    setEditOwn(classroom.ownDepartment);

    if (classroom.virtualMode) {
      setEditPlatform(classroom.location);
    } else {
      const match = classroom.location.match(/^(\d{2})(\d)(\d{2})/); // extrae bloque, piso y aula
      if (match) {
        setEditBlock(match[1]);
        setEditFloor(match[2]);
        setEditRoom(match[3]);
      }
      const sala = classroom.location.match(/SALA (\d+)/);
      setEditClassroomValue(sala ? sala[1] : "");
    }

    setEditing(true);
  };

  const handleCloseEdit = () => {
    setEditing(false);
    setSelectedClassroom(null);
  };

  const handleUpdate = () => {
    if (!validateInputs()) return;
    if (!editCapacity || isNaN(+editCapacity) || +editCapacity <= 0) {
      addToast({
        title: "Error",
        description: "Capacidad inválida",
      });
      return;
    }

    const finalLocation = editVirtual
      ? editPlatform
      : `${editBlock}${editFloor}${editRoom}${
          editClassroomValue ? ` SALA ${editClassroomValue}` : ""
        }`;

    if (!selectedClassroom) {
      addToast({
        title: "Error",
        description: "No se ha seleccionado un aula para editar.",
      });
      return;
    }

    const classroom = {
      capacity: parseInt(editCapacity),
      location: finalLocation,
      ownDepartment: editVirtual ? false : editOwn,
      virtualMode: editVirtual,
      enabled: editEnabled,
      hasRoom: !!editClassroomValue,
      isPointer: false,
    } satisfies UpdateClassroomDTO;
    updateMutation.mutate(
      {
        classroomId: selectedClassroom.id,
        classroom,
      },
      {
        onSuccess: () => {
          setEditing(false);
          addToast({
            title: "Aula actualizada",
            description: "Aula actualizada correctamente",
            variant: "solid",
          });
          console.log("Aula actualizada:", {
            capacity: editCapacity,
            location: finalLocation,
            ownDepartment: editVirtual ? false : editOwn,
            virtualMode: editVirtual,
            enabled: true,
            hasRoom: !!editClassroomValue,
          });
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "Esta aula ya existe. Por favor, verifica los datos.",
            variant: "solid",
          });
        },
      }
    );
  };

  const validateInputs = () => {
    const errors = [];

    if (editVirtual) {
      if (!editPlatform) errors.push("Plataforma virtual");
    } else {
      if (
        !editBlock ||
        isNaN(+editBlock) ||
        +editBlock < 1 ||
        +editBlock > 29
      ) {
        errors.push("Número del bloque válido (01–29)");
      }

      if (!editFloor || isNaN(+editFloor) || +editFloor < 1 || +editFloor > 4) {
        errors.push("Número del piso válido (1–4)");
      }

      if (!editRoom || isNaN(+editRoom) || +editRoom < 0 || +editRoom > 60) {
        errors.push("Número del aula válido (00–60)");
      }
    }

    if (!editCapacity || isNaN(+editCapacity) || +editCapacity <= 0) {
      errors.push("Capacidad válida");
    }

    if (errors.length > 0) {
      addToast({
        title: "Error",
        description: "Completa todos los campos requeridos correctamente.",
      });
      return false;
    }

    return true;
  };

  const handleDelete = async (id: number) => {
    const classroom = classrooms?.find((c) => c.id === id);
    if (!classroom) return;

    const { in_use } = await checkIfClassroomInUse(classroom.id);

    if (in_use) {
      setTargetClassroom(classroom);
      setCannotDeleteModal(true);
    } else {
      setDeleteId(id);
    }
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;

    const classroom = classrooms?.find((c) => c.id === deleteId);
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
        <TableBody items={classrooms?.filter(c => ![1, 2, 3].includes(c.id))}>
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
                    onPress={() => openEditModal(item)}
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
        <Modal
          isOpen={editing}
          onOpenChange={handleCloseEdit}
          backdrop="opaque"
          size="lg"
        >
          <ModalContent>
            <ModalHeader>Editar aula</ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Virtual Mode */}
                <div>
                  <label className="block font-semibold mb-2">
                    ¿El aula es virtual? *
                  </label>
                  <RadioGroup
                    orientation="horizontal"
                    value={editVirtual ? "si" : "no"}
                    onChange={(e) =>
                      setEditVirtual(
                        (e.target as HTMLInputElement).value === "si"
                      )
                    }
                  >
                    <Radio value="si">Sí</Radio>
                    <Radio value="no">No</Radio>
                  </RadioGroup>
                </div>

                {editVirtual ? (
                  <div>
                    <label className="block font-semibold mb-2">
                      Plataforma virtual *
                    </label>
                    <Input
                      type="text"
                      isRequired
                      value={editPlatform}
                      onChange={(e) => setEditPlatform(e.target.value)}
                      placeholder="Ejemplo: Ude@, INGENIA ..."
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block font-semibold mb-2">
                        ¿Pertenece al Departamento de Ingeniería en Sistemas? *
                      </label>
                      <RadioGroup
                        orientation="horizontal"
                        value={editOwn ? "si" : "no"}
                        onChange={(e) =>
                          setEditOwn(
                            (e.target as HTMLInputElement).value === "si"
                          )
                        }
                      >
                        <Radio value="si">Sí</Radio>
                        <Radio value="no">No</Radio>
                      </RadioGroup>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        Número del Bloque *
                      </label>
                      <InputOtp
                        isRequired
                        length={2}
                        value={editBlock}
                        onChange={(e) =>
                          setEditBlock((e.target as HTMLInputElement).value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        Número del Piso *
                      </label>
                      <InputOtp
                        isRequired
                        length={1}
                        value={editFloor}
                        onChange={(e) =>
                          setEditFloor((e.target as HTMLInputElement).value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        Número del Aula en el piso *
                      </label>
                      <InputOtp
                        isRequired
                        length={2}
                        value={editRoom}
                        onChange={(e) =>
                          setEditRoom((e.target as HTMLInputElement).value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        Sala (opcional)
                      </label>
                      <Input
                        type="number"
                        value={editClassroomValue}
                        onChange={(e) => setEditClassroomValue(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Capacidad */}
                <div>
                  <label className="block font-semibold mb-2">
                    Capacidad *
                  </label>
                  <Input
                    isRequired
                    type="number"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={handleCloseEdit}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleUpdate}>
                Guardar cambios
              </Button>
            </ModalFooter>
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