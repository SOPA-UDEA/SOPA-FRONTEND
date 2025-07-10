// import { CustomNotification } from "@/components/util/CustomNotification";
import { useCreateGroupOf, useDeleteGroupById } from "@/hooks/useGroups";
import { GroupRequestUpdate } from "@/interface/Group";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
// import { useState } from "react";

interface Props {
  groupId: number | null;
  setSelectedGroup: React.Dispatch<
    React.SetStateAction<GroupRequestUpdate | null>
  >;
  setSelectedGroupId: React.Dispatch<React.SetStateAction<number | null>>;
  group: GroupRequestUpdate;
  onOpenChange: () => void;
  setUpdated: (a: boolean) => void;
  onOpenChangeUpdateSchedule: () => void;
}

export default function CustomDropdownActions({
  groupId,
  setSelectedGroup,
  group,
  setSelectedGroupId,
  onOpenChange,
  setUpdated,
  onOpenChangeUpdateSchedule,
}: Props) {
  // const [showSuccess, setShowSuccess] = useState(false);
  // const [showError, setShowError] = useState(false);
  // const [message, setmessage] = useState("");

  const { mutateAsync } = useDeleteGroupById();
  const { mutateAsync: mutateAsyncCreate } = useCreateGroupOf();

  const handleDelete = (groupId: number | null | undefined) => {
    const confirm = window.confirm(
      `¿Estás seguro que quieres eliminar el grupo ${groupId}?`
    );
    if (!confirm || groupId === null || groupId === undefined) return;
    mutateAsync(groupId);
    setUpdated(true);
  };

  const handleUpdate = () => {
    if (!group || group === null || group === undefined) return;

    setSelectedGroup({
      groupSize: group.groupSize,
      modality: group.modality,
      maxSize: group.maxSize,
      registeredPlaces: group.registeredPlaces,
      professors: group.professors,
    });
    setSelectedGroupId(groupId);
    onOpenChange();
  };

  const handleUpdateSchedule = () => {
    setSelectedGroupId(groupId);
    onOpenChangeUpdateSchedule();
  };

  const handleCreateGroup = (groupId: number | null | undefined) => {
    if (groupId === null || groupId === undefined) return;
    mutateAsyncCreate(groupId);
    setUpdated(true);
  };

  return (
    <>
      {/* <CustomNotification message={message} type="success" show={showSuccess} />
            <CustomNotification message={message} type="error" show={showError} />
             */}
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Acciones</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Action event example">
          <DropdownItem
            key="newGroup"
            onPress={() => handleCreateGroup(groupId)}>
            Nuevo Grupo
          </DropdownItem>
          <DropdownItem key="editGroup" onPress={() => handleUpdate()}>
            Modificar Grupo
          </DropdownItem>
          <DropdownItem key="editSchedule" onPress={handleUpdateSchedule}>
            Modificar Horario
          </DropdownItem>
          <DropdownItem key="editClassRoom">Modificar Aula</DropdownItem>
          <DropdownItem
            key="deleteGroup"
            onPress={() => handleDelete(groupId)}
            className="text-danger"
            color="danger">
            Eliminar Grupo
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
