import { useCreateGroupOf, useDeleteGroupById, useUpdateGroupClassroom } from "@/hooks/useGroups";
import { GroupRequestUpdate } from "@/interface/Group";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";

interface Props {
  groupId: number | null;
  setSelectedGroup: React.Dispatch<React.SetStateAction<GroupRequestUpdate | null>>;
  setSelectedGroupId: React.Dispatch<React.SetStateAction<number | null>>;
  group: any;
  onOpenChange: () => void;
  setUpdated: (a: boolean) => void;
  onOpenChangeUpdateSchedule: () => void;
  onOpenChangeUpdateClassroom: () => void;
}

export default function CustomDropdownActions({
  groupId,
  setSelectedGroup,
  group,
  setSelectedGroupId,
  onOpenChange,
  setUpdated,
  onOpenChangeUpdateSchedule,
  onOpenChangeUpdateClassroom
}: Props){
  const { mutateAsync} = useDeleteGroupById();
  const { mutateAsync: mutateAsyncCreate } = useCreateGroupOf();

  const handleDelete = (id: number | null | undefined) => {
    const confirm = window.confirm(`¿Estás seguro que quieres eliminar el grupo ${id}?`);
    if (!confirm || id===null || id===undefined) return;
    mutateAsync(id);
    setUpdated(true);
  };

  const handleUpdate = () => {
    if (!group) return;
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

  const handleUpdateClassroom = () => {
    setSelectedGroupId(groupId);
    onOpenChangeUpdateClassroom();
  };

  const handleCreateGroup = (id: number | null | undefined) => {
    if (id===null || id===undefined) return;
    mutateAsyncCreate(id);
    setUpdated(true);
  };

  const { mutateAsync: mutateAsyncUpdateClassroom } = useUpdateGroupClassroom();

  const handleSearchClassroom = async () => {
    if (!groupId) return;
    await mutateAsyncUpdateClassroom(groupId); // o como se llame tu mutation
    setUpdated(true); // <- esto ahora dispara el refetch
  };




  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Acciones</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Action event example">
        <DropdownItem key="newGroup" onPress={() => handleCreateGroup(groupId)}>Nuevo Grupo</DropdownItem>
        <DropdownItem key="editGroup" onPress={handleUpdate}>Modificar Grupo</DropdownItem>
        <DropdownItem key="editSchedule" onPress={handleUpdateSchedule}>Modificar Horario</DropdownItem>
        <DropdownItem key="editClassRoom" onPress={handleUpdateClassroom}>Modificar Aula</DropdownItem>
        <DropdownItem key="searchClassRoom" onPress={handleSearchClassroom}>Buscar Aula</DropdownItem>
        <DropdownItem key="deleteGroup" onPress={() => handleDelete(groupId)} className="text-danger" color="danger">
          Eliminar Grupo
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
