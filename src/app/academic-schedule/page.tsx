"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipLoader } from 'react-spinners';
import { Toaster } from "react-hot-toast";
import { ModalSchedule } from "./components/ModalSchedule";
import { AcademicScheduleResponse } from "@/interface/AcademicSchedule";
import { CustomDataGrid } from "@/components/util/CustomDataGrid";
import { ModalPensums } from "./components/ModalPensums";
import { Button, useDisclosure } from "@heroui/react";
import CustomDropdownActions from "./components/CustomDropdownActions";
import ModalUpdateGroup from "./components/ModalUpdateGroup";
import { GroupRequestUpdate, GroupResponse } from "@/interface/Group";
import ModalUpdateGroupsSchedule from "./components/ModalUpdateGroupsSchedule";
import { DataAnalysis } from "./components/DataAnalysis";
import { useGroupsBySchedulePaginated, useMarkMirrorGroups } from "@/hooks/useGroups";
import { tableData } from "./helpers/groupTableData";

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
	const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
	const { mutateAsync } = useMarkMirrorGroups();

	const [currentPage, setCurrentPage] = useState(1);
	
	const { isOpen: isOpenUpdate, onOpenChange: onOpenChangeUpdate, onOpen: onOpenUpdate } = useDisclosure();
	const { isOpen: isOpenUpdateSchedule, onOpenChange: onOpenChangeUpdateSchedule, onOpen: onOpenUpdateSchedule } = useDisclosure();

	const stablePensumIds = useMemo(() => [...selectedPensumsIds], [selectedPensumsIds]);

	const requestBase = useMemo(() => ({
		academicScheduleId: academicSchedule?.id,
		pensumIds: stablePensumIds,
		skip: (currentPage - 1) * 15,
		take: 15
	}), [academicSchedule?.id, stablePensumIds, currentPage]);

	const { data, isPending } = useGroupsBySchedulePaginated(requestBase);

	// const totalPages = useMemo(() => {
	// 	return data ? Math.ceil(data.total / 15) : 1;
	// }, [data]);

	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		if (data) {
			setGroups(data.data)
			console.log(data);
			setTotalPages(Math.ceil(data.total / 15))
		}
	}, [data, updated, academicSchedule]);

	const enrichedGroups = tableData(groups);

	const handleMarkMirrorGroups = () => {
		if (selectedGroupIds.length < 2) {
			alert('Debes seleccionar al menos dos grupos');
			return
		}
		mutateAsync(selectedGroupIds, {
			onSuccess(data) {
				if (data === "groups are not mirrors") {
					alert('los grupos no cumplen las condiciones para ser espejos');
					return
				}
				setUpdated(true)
			},
		})
	}

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
		{ field: "notifications", headerName: "Notificaciones" }
	];

	return (
		<>
			<Toaster position="top-right" />
			<div>
				<h1 className="text-h-2 text-primary-7740 mb-6">
					Programación Académica
				</h1>
			</div>
			<div className="flex justify-between mb-4">
				<div className="flex gap-4">
					<ModalPensums
						setPensums={setSelectedPensumsIds}
						action="create"
						onOpenSchedule={onOpen}
						text="Crear o cargar Programación"
						setAction={setAction}
						isFromDrai={false}
						setImportType={setImportType}
						setFile={setFile}
					/>
					{groups.length === 0 && (
						<ModalPensums
							setPensums={setSelectedPensumsIds}
							action={"drai"}
							onOpenSchedule={onOpen} text={"Importar Aulas DRAI"}
							setAction={setAction}
							isFromDrai={true}
							setImportType={setImportType}
							setFile={setFile}
						/>
					)}
					{groups.length > 0 && (
						<DataAnalysis action="ANALYSIS"
						/>
					)}
				</div>
				{academicSchedule &&
					<Button color="secondary" onPress={() => handleMarkMirrorGroups()}>
						Marcar espejos
					</Button>}
			</div>
			<ModalSchedule
				setAcademicSchedule={setAcademicSchedule}
				selectedPensumsIds={selectedPensumsIds}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				action={action}
				importType={importType}
				file={file}
			/>
			<div className="mt-4">
				{!isPending && (
					academicSchedule && (
						<CustomDataGrid
							data={[...enrichedGroups].sort((a, b) => a.subjectLevel - b.subjectLevel)}
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
											onOpenChangeUpdateSchedule={onOpenUpdateSchedule} />
									),
								},
							]}
							onSelectionChange={(keys) => {
								if (keys === "all") {
									setSelectedGroupIds(enrichedGroups.map((g) => g.id));
								} else {
									const numericIds = Array.from(keys).map((k) => Number(k));
									setSelectedGroupIds(numericIds);
								}
							} }
							selectedKeys={new Set(selectedGroupIds.map(String))} 
							currentPage={currentPage} 
							totalPages={totalPages} 
							onPageChange={(page) => setCurrentPage(page)}
							/>
					)
				)}
				{isPending && academicSchedule !== null && (
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
			{selectedGroupId && (
				<ModalUpdateGroupsSchedule
					onOpenChange={onOpenChangeUpdateSchedule}
					isOpen={isOpenUpdateSchedule}
					selectedGroupId={selectedGroupId}
				/>)
			}
			{groups.length > 0 && (
				<DataAnalysis action="EXPORT" />
			)}
		</>
	);
};

export default Page;
