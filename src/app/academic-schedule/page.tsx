"use client";

import { useEffect, useState } from "react";
import { ClipLoader } from 'react-spinners';
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
import ModalUpdateGroupsSchedule from "./components/ModalUpdateGroupsSchedule";

const Page = () => {
	const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
	const { isOpen, onOpenChange, onOpen } = useDisclosure();
	const [selectedGroup, setSelectedGroup] = useState<GroupRequestUpdate | null>(null);
	const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
	const [groups, setGroups] = useState<GroupResponse[]>([]);
	const [selectedPensumsIds, setSelectedPensumsIds] = useState<number[]>([]);
	const [updated, setUpdated] = useState(false)
	const [action, setAction] = useState("");
	const [importType, setImportType] = useState<"CREATE" | "UPDATE">("CREATE");
	const [file, setFile] = useState<File | null>(null);

	const { mutateAsync, isPending } = useGroupsBySchedulePensum()
	const { isOpen: isOpenUpdate, onOpenChange: onOpenChangeUpdate, onOpen: onOpenUpdate } = useDisclosure();
	const { isOpen: isOpenUpdateSchedule, onOpenChange: onOpenChangeUpdateSchedule, onOpen: onOpenUpdateSchedule } = useDisclosure();

	useEffect(() => {
		if (academicSchedule) {
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
	}, [academicSchedule, selectedPensumsIds, updated]);


	const enrichedGroups = groups.map((group) => {
		const professorNames = group.group_x_professor.map((gxp) => gxp.professor.name).join(", ");
		const professorsIds = group.group_x_professor.map((gxp) => gxp.professor.id);
		const groupedClassroom = group.classroom_x_group.reduce((acc, { mainClassroom, mainSchedule }) => {
			if (!acc[mainClassroom.location]) {
				acc[mainClassroom.location] = [];
			}
			acc[mainClassroom.location].push(mainSchedule);
			return acc;
		}, {} as Record<string, string[]>);

		// create arrays for classrooms and schedules
		const classrooms: string[] = [];
		const schedules: string[] = [];

		// separate schedules by classroom with space key
		for (const [classroom, scheduleList] of Object.entries(groupedClassroom)) {
			classrooms.push(classroom);
			schedules.push(scheduleList.join(" "));
		}

		// join classrooms and schedules into strings separated by " | "
		const classroomString = classrooms.join(" | ");
		const scheduleString = schedules.join(" | ");
		return {
			professorsN: professorNames,
			professors: professorsIds,
			mirrorGroup: group.mirror_group.name,
			subjectName: group.subject.name,
			subjectCode: group.subject.code,
			subjectLevel: group.subject.level,
			subjectModality: group.subject.pensum.academic_program.modalityAcademic,
			classrooms: classroomString,
			schedules: scheduleString,
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
		{ field: "classrooms", headerName: "Aulas" },
		{ field: "schedules", headerName: "Horarios" },
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
					text={"Crear o cargar Programación"}
					setAction={setAction}
					isFromDrai={false}
					setImportType={setImportType}
					file={file}
					setFile={setFile}
				/>
			}
			{selectedPensumsIds?.length > 0 && (
				<ModalSchedule
					setAcademicSchedule={setAcademicSchedule}
					selectedPensumsIds={selectedPensumsIds}
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					action={action}
					importType={importType}
					file={file}
				/>
			)}
			<div className="mt-4">
				{!isPending && (
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
											onOpenChange={onOpenUpdate}
											setUpdated={setUpdated}
											onOpenChangeUpdateSchedule={onOpenUpdateSchedule}
										/>
									),
								},
							]}
						/>
					)
				)}
				{isPending && (
					<div className="flex flex-col items-center justify-center mt-2 mb-2 space-y-2">
						<ClipLoader color="#4A5568" size={60} />
						<p className="text-gray-600 text-sm text-center">
							Cargando programación académica...
						</p>
					</div>
				)}

			</div>
			{selectedGroup && selectedGroupId && (
				<ModalUpdateGroup
					isOpen={isOpenUpdate}
					onOpenChange={onOpenChangeUpdate}
					selectedGroup={selectedGroup}
					groupId={selectedGroupId}
					setUpdated={setUpdated} />
			)}
			{
				<ModalUpdateGroupsSchedule
					onOpenChange={onOpenChangeUpdateSchedule}
					isOpen={isOpenUpdateSchedule}
				/>
			}
			<ModalPensums
				setPensums={setSelectedPensumsIds}
				action={"drai"}
				onOpenSchedule={onOpen} text={"Cargar aulas DRAI"}
				setAction={setAction}
				isFromDrai={true}
				setImportType={setImportType}
				file={file}
				setFile={setFile}
			/>

		</>
	);
};

export default Page;
