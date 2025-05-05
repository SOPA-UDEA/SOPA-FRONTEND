import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/react";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

import { TimeInput } from "@heroui/react";

import { Time } from "@internationalized/date";

import { Select, SelectItem } from "@heroui/react";

export const classrooms = [
  { key: "xx-xxx", label: "18-218" },
  { key: "xx-xxx", label: "18-305" },
  { key: "No aula", label: "No aula" },
];

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        endContent={<ArrowTopRightOnSquareIcon className="h-4 w-4" />}
        size="sm"
        radius="full"
      >
        Gestionar
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        scrollBehavior="inside"
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Asignar aula(s)
              </ModalHeader>
              <ModalBody>
                <Table
                  removeWrapper
                >
                  <TableHeader >
                    <TableColumn>Dia de la semana</TableColumn>
                    <TableColumn>Hora de inicio</TableColumn>
                    <TableColumn>Hora de fin</TableColumn>
                    <TableColumn>Aula</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell>xxxxx</TableCell>
                      <TableCell>
                        <TimeInput
                          isReadOnly
                          defaultValue={new Time(11, 45)}
                          label={null}
                        />
                      </TableCell>
                      <TableCell>
                        <TimeInput
                          isReadOnly
                          defaultValue={new Time(11, 45)}
                          label={null}
                        />
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Select
                          className="max-w-xs"
                          defaultSelectedKeys={["No aula"]}
                          scrollShadowProps={{
                            isEnabled: false,
                          }}
                        >
                          {classrooms.map((classroom) => (
                            <SelectItem key={classroom.key}>
                              {classroom.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                    <TableRow key="2">
                      <TableCell>xxxxx</TableCell>
                      <TableCell>
                        <TimeInput
                          isReadOnly
                          defaultValue={new Time(11, 45)}
                          label={null}
                        />
                      </TableCell>
                      <TableCell>
                        <TimeInput
                          isReadOnly
                          defaultValue={new Time(11, 45)}
                          label={null}
                        />
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Select
                          className="max-w-xs"
                          defaultSelectedKeys={["No aula"]}
                          scrollShadowProps={{
                            isEnabled: false,
                          }}
                        >
                          {classrooms.map((classroom) => (
                            <SelectItem key={classroom.key}>
                              {classroom.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter >
                <Button color="danger" variant="light" onPress={onClose}>
                  Restaurar
                </Button>
                <Button color="secondary" onPress={onClose}>
                  Aplicar cambios
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
