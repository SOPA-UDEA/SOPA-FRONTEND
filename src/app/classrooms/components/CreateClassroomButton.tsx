import React, { useState } from "react";
import {
  addToast,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Input,
  InputOtp,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { useCreateClassroom } from "@/hooks/useClassroom";

export default function ClassroomCreator() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const createMutation = useCreateClassroom();
  const [newCapacity, setNewCapacity] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newOwn, setNewOwn] = useState(false);
  const [newVirtual, setNewVirtual] = useState(false);
  const [newRoom, setNewRoom] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [, setClassroomValue] = useState("");
  const [, setClassroomNumberError] = useState("");

  const [blockNumber, setBlockNumber] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const handleBlockChange = (value: string) => {
    setBlockNumber(value);
  };

  const handleFloorChange = (value: string) => {
    setFloorNumber(value);
  };

  const handleRoomChange = (value: string) => {
    setRoomNumber(value);
  };
const validateInputs = () => {
  const errors = [];

  if (newVirtual) {
    if (!selectedPlatform) errors.push("Plataforma virtual");
  } else if (newOwn) {
    if (!newLocation) errors.push("Ubicación");
    if (!newRoom) errors.push("Número de sala");
  } else {
    if (!blockNumber) errors.push("Número del bloque");
    if (!floorNumber) errors.push("Número del piso");
    if (!roomNumber) errors.push("Número del aula");
  }

  if (!newCapacity || isNaN(+newCapacity) || +newCapacity <= 0) {
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



  const classroomNumber = `${blockNumber}${floorNumber}${roomNumber}`;

  const handleCreate = () => {
  if (!validateInputs()) return;

  const finalLocation = newVirtual 
    ? selectedPlatform 
    : newOwn 
      ? `${newLocation} sala ${newRoom}` 
      : classroomNumber;

  const finalCapacity = parseInt(newCapacity, 10);

    createMutation.mutate(
      {
        capacity: finalCapacity,
        location: finalLocation,
        ownDepartment: newOwn,
        virtualMode: newVirtual,
      },
      {
        onSuccess: () => {
          handleClose();
          addToast({
            title: "Aula creada",
            description: "Aula creada correctamente",
            variant: "solid",
          });
        },
        onError: () => {
          addToast({
            title: "Error",
            description: 'Esta aula ya existe. Por favor, verifica los datos.',
            variant: "solid",
          });
        },
      }
    );
  };

  const handleCapacityChange = (value: string) => {
    setNewCapacity(value);
  };

  const handleClose = () => {
    setNewCapacity("");
    setNewLocation("");
    setNewOwn(false);
    setNewVirtual(false);
    setNewRoom("");
    setBlockNumber("");
    setFloorNumber("");
    setRoomNumber("");
    setClassroomValue("");
    setClassroomNumberError("");
    setSelectedPlatform("");
    onClose();
  };

  return (
    <div className="p-6 space-y-6">
      <Button color="primary" variant="bordered" onPress={onOpen}>
        Crear aula
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleClose}
        backdrop="opaque"
        size="lg"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
      >
        <ModalContent>
          <ModalHeader>Crear nueva aula</ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-2">
                  ¿El aula es virtual? <span className="text-black">*</span>
                </label>
                <RadioGroup
                  orientation="horizontal"
                  value={newVirtual ? "si" : "no"}
                  onChange={(e) =>
                    setNewVirtual((e.target as HTMLInputElement).value === "si")
                  }
                >
                  <Radio value="si">Sí</Radio>
                  <Radio value="no">No</Radio>
                </RadioGroup>
                <p className="text-sm text-gray-500 mt-1">
                  {newVirtual
                    ? "Esta aula es virtual"
                    : "Esta aula no es virtual"}
                </p>
              </div>

              {newVirtual ? (
                <>
                  <div>
                    <label className="block font-semibold mb-2">
                      Seleccione la plataforma virtual{" "}
                      <span className="text-black">*</span>
                    </label>
                    <Select
                      isRequired={true}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        setSelectedPlatform(selectedKey);
                      }}
                      placeholder="Seleccionar plataforma"
                    >
                      <SelectItem key="Ude@">Ude@</SelectItem>
                      <SelectItem key="INGENIA">INGENIA</SelectItem>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-semibold mb-2">
                      ¿Pertenece al Departamento de Ingeniería en Sistemas?{" "}
                      <span className="text-black">*</span>
                    </label>
                    <RadioGroup
                      orientation="horizontal"
                      value={newOwn ? "si" : "no"}
                      onChange={(e) =>
                        setNewOwn((e.target as HTMLInputElement).value === "si")
                      }
                    >
                      <Radio value="si">Sí</Radio>
                      <Radio value="no">No</Radio>
                    </RadioGroup>
                    <p className="text-sm text-gray-500 mt-1">
                      {newOwn
                        ? "Esta aula hace parte del Departamento de Ingeniería en Sistemas"
                        : "Esta aula no pertenece al Departamento de Ingeniería en Sistemas"}
                    </p>
                  </div>

                  {newOwn ? (
                    <div>
                      <label className="block font-semibold mb-2">
                        Número de aula <span className="text-black">*</span>
                      </label>
                      <Select
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          setNewLocation(selectedKey + newRoom);
                        }}
                        placeholder="Seleccionar aula"
                      >
                        <SelectItem key="18325">18325</SelectItem>
                        <SelectItem key="18218">18218</SelectItem>
                      </Select>

                      <div>
                        <label className="block font-semibold mb-2">
                          Número de Sala <span className="text-black">*</span>
                        </label>
                        <Select
                          onSelectionChange={(keys) => {
                            const selectedKey = Array.from(keys)[0] as string;
                            setNewRoom(selectedKey);
                            setNewLocation(
                              newLocation.split(" ")[0] + selectedKey
                            );
                          }}
                          placeholder="Seleccionar sala"
                        >
                          <SelectItem key="1">Sala 1</SelectItem>
                          <SelectItem key="2">Sala 2</SelectItem>
                          <SelectItem key="3">Sala 3</SelectItem>
                          <SelectItem key="4">Sala 4</SelectItem>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div>
                        <label className="block font-semibold mb-2">
                          Número del Bloque{" "}
                          <span className="text-black">*</span>
                        </label>
                        <InputOtp
                          isRequired={true}
                          length={2}
                          value={blockNumber}
                          onChange={(e) =>
                            handleBlockChange(
                              (e.target as HTMLInputElement).value
                            )
                          }
                          isInvalid={
                            blockNumber.length > 0 &&
                            (parseInt(blockNumber) < 1 ||
                              parseInt(blockNumber) > 29)
                          }
                          errorMessage="El bloque debe estar entre 01 y 29"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Número del Piso <span className="text-black">*</span>
                        </label>
                        <InputOtp
                          isRequired={true}
                          length={1}
                          value={floorNumber}
                          onChange={(e) =>
                            handleFloorChange(
                              (e.target as HTMLInputElement).value
                            )
                          }
                          isInvalid={
                            floorNumber.length > 0 &&
                            (parseInt(floorNumber) < 1 ||
                              parseInt(floorNumber) > 4)
                          }
                          errorMessage="El piso debe estar entre 1 y 4"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Número del Aula en el piso{" "}
                          <span className="text-black">*</span>
                        </label>
                        <InputOtp
                          isRequired={true}
                          length={2}
                          value={roomNumber}
                          onChange={(e) =>
                            handleRoomChange(
                              (e.target as HTMLInputElement).value
                            )
                          }
                          isInvalid={
                            roomNumber.length > 0 &&
                            (parseInt(roomNumber) < 1 ||
                              parseInt(roomNumber) > 30)
                          }
                          errorMessage="El aula debe estar entre 01 y 30"
                        />
                      </div>

                      <div className="mt-4">
                        <p className="font-light text-sm text-gray-500">
                          (Número completo del Aula: {classroomNumber})
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block font-semibold mb-2">
                  Cantidad máxima del aula <span className="text-black">*</span>
                </label>
                <Input
                  isRequired
                  type="number"
                  value={newCapacity}
                  onChange={(e) => handleCapacityChange(e.target.value)}
                  placeholder="Ingresa la capacidad del aula (1-100)"
                  min={1}
                  max={100}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onPress={handleClose}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleCreate}>
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}