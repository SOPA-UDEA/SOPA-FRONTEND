"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { ModalSchedule } from "./components/ModalSchedule";
import { AcademicScheduleResponse } from "@/interface/AcademicSchedule";
import { CustomDataGrid } from "@/components/util/CustomDataGrid";
import { ModalPensums } from "./components/ModalPensums";
import { useDisclosure } from "@heroui/react";
import CustomDropdownActions from "./components/CustomDropdownActions";
import ModalUpdateGroup from "./components/ModalUpdateGroup";
import { GroupRequestUpdate, GroupResponse } from "@/interface/Group";
import { useGroupsBySchedulePensum } from "@/hooks/useGroups";

const Page = () => {
	const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
	const { isOpen, onOpenChange, onOpen } = useDisclosure();

	const [selectedGroup, setSelectedGroup] = useState<GroupRequestUpdate | null>(null);
	const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
	const [ groups, setGroups ] = useState<GroupResponse[]>([]);
	const [selectedPensumsIds, setSelectedPensumsIds] = useState<number[]>([]);
	const [ updated, setUpdated ] = useState(false)

	const [action, setAction] = useState("");
	
	const { mutateAsync } = useGroupsBySchedulePensum()

	useEffect(() => {
		if ( academicSchedule ) {
			const requestBase = {
				'scheduleId': academicSchedule.id,
				'pensumIds': selectedPensumsIds
			};
			mutateAsync(requestBase, {
				onSuccess: (data) => {
					setGroups(data);
				}
			});
		}
	}, [ academicSchedule, selectedPensumsIds, updated ]);

	const { isOpen: isOpenUpdate, onOpenChange: onOpenChangeUpdate, onOpen: onOpenUpdate } = useDisclosure();

	const enrichedGroups = groups.map((group) => {
			const professorNames = group.group_x_professor.map((gxp) => gxp.professor.name).join(", ");
			const professorsIds = group.group_x_professor.map((gxp) => gxp.professor.id);
			const schedules = group.classroom_x_group.map((cxg) => cxg.mainSchedule).join(" | ");
			return {
				professorsN: professorNames,
				professors: professorsIds,
				mirrorGroup: group.mirror_group.name,
				subjectName: group.subject.name,
				subjectCode: group.subject.code,
				subjectLevel: group.subject.level,
				subjectModality: group.subject.pensum.academic_program.modalityAcademic,
				schedules: schedules,
				baseGroup: group.code === 0 ? "Grupo base" : group.code,
				...group,
			};
	});

	const columns = [
		{ field: "id", headerName: "ID" },
		{ field: "mirrorGroup", headerName: "Código espejo" },
		{ field: "subjectCode", headerName: "Código materia" },
		{ field: "subjectName", headerName: "Materia" },
		{ field: "subjectLevel", headerName: "Nivel" },
		{ field: "subjectModality", headerName: "Modalidad" },
		{ field: "maxSize", headerName: "Max. cupos" },
		{ field: "groupSize", headerName: "Cupos" },
		{ field: "registeredPlaces", headerName: "Matriculados" },
		{ field: "baseGroup", headerName: "Numero del grupo" },
		{ field: "aula", headerName: "Aula" },
		{ field: "schedules", headerName: "Horario" },
		{ field: "professorsN", headerName: "Profesores" },
		{ field: "modality", headerName: "Modalidad grupo" },
	];

	return (
		<>
			<Toaster position="top-right" />
			<div>
				<h1 className="text-h-2 text-primary-7740 mb-6">
					Programación Académica
				</h1>
			</div>
			{
				<ModalPensums
					setPensums={setSelectedPensumsIds}
					action={"create"}
					onOpenSchedule={onOpen} 
					text={"Crear Programación nueva"} 
					setAction={ setAction }				/>
			}
			{selectedPensumsIds?.length > 0 && (
				<ModalSchedule
					setAcademicSchedule={setAcademicSchedule}
					selectedPensumsIds={selectedPensumsIds}
					isOpen={isOpen}
					onOpenChange={onOpenChange} 
					action={ action }				/>
			)}
			<div className="mt-4">
				{
					academicSchedule && (
						<CustomDataGrid
							data={[...enrichedGroups].sort(
							(a, b) => a.subjectLevel - b.subjectLevel
							)}
							checkbox={true}
							columns={[
							...columns,
							{
								field: "actions",
								headerName: "Acciones",
								renderActions: (item) => (
									<CustomDropdownActions
										groupId={item.id}
										setSelectedGroup={setSelectedGroup}
										setSelectedGroupId={setSelectedGroupId}
										group={item} 
										onOpenChange={ onOpenUpdate }
									/>
								),
							},
							]}
						/>
					)
				}

			</div>
			{selectedGroup && selectedGroupId && (
				<ModalUpdateGroup
					isOpen={isOpenUpdate}
					onOpenChange={onOpenChangeUpdate}
					selectedGroup={selectedGroup}
					groupId={selectedGroupId} 
					setUpdated={ setUpdated }				/>
			)}
			<ModalPensums
				setPensums={setSelectedPensumsIds}
				action={"classroom"}
				onOpenSchedule={onOpen} text={"Cargar aulas DRAI"} 
				setAction={ setAction }
				/>
		</>
	);
};

export default Page;
