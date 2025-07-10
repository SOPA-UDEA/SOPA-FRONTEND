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
  const [newOwn, setNewOwn] = useState(false);
  const [newVirtual, setNewVirtual] = useState(false);
  const [enterPlatform, setEnterPlatform] = useState("");
  const [classroomValue, setClassroomValue] = useState("");
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
      if (!enterPlatform) errors.push("Plataforma virtual");
    } else {
      if (
        !blockNumber ||
        isNaN(+blockNumber) ||
        +blockNumber < 1 ||
        +blockNumber > 29
      ) {
        errors.push("Número del bloque válido (01–29)");
      }

      if (
        !floorNumber ||
        isNaN(+floorNumber) ||
        +floorNumber < 1 ||
        +floorNumber > 4
      ) {
        errors.push("Número del piso válido (1–4)");
      }

      if (
        !roomNumber ||
        isNaN(+roomNumber) ||
        +roomNumber < 0 ||
        +roomNumber > 60
      ) {
        errors.push("Número del aula válido (00–60)");
      }
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
      ? enterPlatform
      : `${classroomNumber}${classroomValue ? ` SALA ${classroomValue}` : ""}`;

    const finalCapacity = parseInt(newCapacity, 10);

    createMutation.mutate(
      {
        capacity: finalCapacity,
        location: finalLocation,
        ownDepartment: newOwn,
        virtualMode: newVirtual,
        enabled: true,
        hasRoom: !!classroomValue,
        isPointer: false, // Default value for isPointer
      },
      {
        onSuccess: () => {
          handleClose();
          addToast({
            title: "Aula creada",
            description: "Aula creada correctamente",
            variant: "solid",
          });
          //log to console
          console.log("Aula creada:", {
            capacity: finalCapacity,
            location: finalLocation,
            ownDepartment: newOwn,
            virtualMode: newVirtual,
            enabled: true,
            hasClass: !!classroomValue,
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

  const handleCapacityChange = (value: string) => {
    setNewCapacity(value);
  };

  const handleClose = () => {
    setNewCapacity("");
    setNewCapacity("");
    setNewCapacity("");
    setNewOwn(false);
    setBlockNumber("");
    setFloorNumber("");
    setRoomNumber("");
    setClassroomValue("");
    setClassroomNumberError("");
    setEnterPlatform("");
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
        isKeyboardDismissDisabled={false}>
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
                  }>
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
                      Ingrese el nombre de la plataforma virtual{" "}
                      <span className="text-black">*</span>
                    </label>
                    <Input
                      type="text"
                      isRequired={true}
                      value={enterPlatform}
                      onChange={(e) => setEnterPlatform(e.target.value)}
                      placeholder="Ejemplo: Ude@, INGENIA ..."
                    />
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
                      }>
                      <Radio value="si">Sí</Radio>
                      <Radio value="no">No</Radio>
                    </RadioGroup>
                    <p className="text-sm text-gray-500 mt-1">
                      {newOwn
                        ? "Esta aula hace parte del Departamento de Ingeniería en Sistemas"
                        : "Esta aula no pertenece al Departamento de Ingeniería en Sistemas"}
                    </p>
                  </div>
                  <div>
                    <div>
                      <label className="block font-semibold mb-2">
                        Número del Bloque <span className="text-black">*</span>
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
                          handleRoomChange((e.target as HTMLInputElement).value)
                        }
                        isInvalid={
                          roomNumber.length > 0 &&
                          (parseInt(roomNumber) < 0 ||
                            parseInt(roomNumber) > 60)
                        }
                        errorMessage="El aula debe estar entre 0 y 60"
                      />
                    </div>

                    <div className="mt-4">
                      <p className="font-light text-sm text-gray-500">
                        (Número completo del Aula: {classroomNumber})
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">
                      Ingresa número de sala{" "}
                      <span className="text-black font-extralight text-xs">
                        (optional)
                      </span>
                    </label>
                    <Input
                      type="number"
                      value={classroomValue}
                      onChange={(e) => setClassroomValue(e.target.value)}
                      placeholder="Ejemplo: 1, 2, 3..."
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold mb-2">
                  Capacidad máxima del aula{" "}
                  <span className="text-black">*</span>
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
