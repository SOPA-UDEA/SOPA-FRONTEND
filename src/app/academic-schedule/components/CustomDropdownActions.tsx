import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";

export default function CustomDropdownActions(){

    return (
        <Dropdown>
        <DropdownTrigger>
            <Button variant="bordered">Acciones</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Action event example" onAction={(key) => alert(key)}>
            <DropdownItem key="newGroup">Nuevo Grupo</DropdownItem>
            <DropdownItem key="editGroup">Modificar Grupo</DropdownItem>
            <DropdownItem key="editSchedule">Modificar Horario</DropdownItem>
            <DropdownItem key="editClassRoom">Modificar Aula</DropdownItem>
            <DropdownItem key="deleteGroup" className="text-danger" color="danger">
            Eliminar Grupo
            </DropdownItem>
        </DropdownMenu>
        </Dropdown>
    ) 
}



