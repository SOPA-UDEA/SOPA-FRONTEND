"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";
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
import { usePensums } from "@/hooks/usePensums";
import { useQueryClient } from "@tanstack/react-query";
import ModalUpdateClassroom from "./components/ModalUpdateClassroom";

const Page = () => {
  const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [selectedGroup, setSelectedGroup] = useState<GroupRequestUpdate | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [selectedPensumsIds, setSelectedPensumsIds] = useState<number[]>([]);
  const [updated, setUpdated] = useState(false);
  const [action, setAction] = useState("");
  const [importType, setImportType] = useState<"CREATE" | "UPDATE">("CREATE");
  const [file, setFile] = useState<File | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const { mutateAsync } = useMarkMirrorGroups();
  const { isOpen: isOpenUpdate, onOpenChange: onOpenChangeUpdate, onOpen: onOpenUpdate } = useDisclosure();
  const { isOpen: isOpenUpdateSchedule, onOpenChange: onOpenChangeUpdateSchedule, onOpen: onOpenUpdateSchedule } = useDisclosure();
  const { pensums } = usePensums();
  const queryClient = useQueryClient();
  const { isOpen: isOpenUpdateClassroom, onOpenChange: onOpenChangeUpdateClassroom, onOpen: onOpenUpdateClassroom } = useDisclosure();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [canQuery, setCanQuery] = useState(false);

  const stablePensumIds = useMemo(() => [...selectedPensumsIds], [selectedPensumsIds]);

  useEffect(() => {
    setPage(0);
  }, [academicSchedule?.id, stablePensumIds.join(",")]);

  const requestBase = useMemo(
    () => ({
      academicScheduleId: academicSchedule?.id,
      pensumIds: stablePensumIds,
      skip: page * pageSize,
      take: pageSize,
    }),
    [academicSchedule?.id, stablePensumIds, page, pageSize]
  );

  const enabled = Boolean(canQuery && typeof academicSchedule?.id === "number" && stablePensumIds.length > 0);
  const { data, isFetching } = useGroupsBySchedulePaginated(requestBase, enabled);

  useEffect(() => {
    if (data) setGroups(data.data);
  }, [data, updated, academicSchedule]);

  useEffect(() => {
    if (!updated) return;

    // Usas el mismo key que ya cancelas arriba: ["groups"]
    queryClient.invalidateQueries({ queryKey: ["groups"] });

    // Reseteas el flag para no entrar en bucle
    setUpdated(false);
  }, [updated, queryClient]);
  const enrichedGroups = tableData(groups);

  const groupById = useMemo(() => {
    const m = new Map<number, GroupResponse>();
    for (const g of groups) m.set(g.id, g);
    return m;
  }, [groups]);

  const displayRows = useMemo(() => {
    return enrichedGroups.map((row: any) => {
      const original = groupById.get(row.id);
      const name = original?.subject?.pensum?.academic_program?.name ?? "";
      const version = original?.subject?.pensum?.version ?? "";
      const pensumLabel = name && version ? `${name} (Versión: ${version})` : name || (version ? `(version: ${version})` : "");
      return { ...row, semesterCalendar: pensumLabel };
    });
  }, [enrichedGroups, groupById, academicSchedule?.semester]);

  const handleMarkMirrorGroups = () => {
    if (selectedGroupIds.length < 2) {
      alert("Debes seleccionar al menos dos grupos");
      return;
    }
    mutateAsync(selectedGroupIds, {
      onSuccess(d) {
        if (d === "groups are not mirrors") {
          alert("Los grupos no cumplen las condiciones para ser espejos");
          return;
        }
        setUpdated(true);
      },
    });
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "mirrorGroup", headerName: "Código espejo" },
    { field: "subjectCode", headerName: "Código materia" },
    { field: "subjectName", headerName: "Materia" },
    { field: "subjectLevel", headerName: "Nivel" },
    { field: "subjectModality", headerName: "Modalidad" },
    { field: "semesterCalendar", headerName: "Pensum" },
    { field: "maxSize", headerName: "Max. cupos" },
    { field: "groupSize", headerName: "Cupos" },
    { field: "registeredPlaces", headerName: "Matriculados" },
    { field: "baseGroup", headerName: "Número del grupo" },
    { field: "classrooms", headerName: "Aulas" },
    { field: "schedules", headerName: "Horarios" },
    { field: "professorsN", headerName: "Profesores" },
    { field: "modality", headerName: "Modalidad grupo" },
    { field: "notifications", headerName: "Notificaciones" },
  ];

  const selectedPensumNames = useMemo(() => {
    if (selectedPensumsIds.length === 0) return null;
    return pensums
      .filter((p) => selectedPensumsIds.includes(p.id))
      .map((p) => {
        const modalidad = p.academicProgramId === 1 ? "Presencial" : p.academicProgramId === 2 ? "Virtual" : "Virtual regiones";
        return `Pensum (versión ${p.version}, ${modalidad})`;
      })
      .join(", ");
  }, [selectedPensumsIds, pensums]);

  const handleOpenSchedule = () => {
    setCanQuery(false);
    setSelectedGroupIds([]);
    queryClient.cancelQueries({ queryKey: ["groups"] });
    onOpen();
  };

  const showOverlay = canQuery && Boolean(academicSchedule) && isFetching;
  const showTable = displayRows.length > 0;

  return (
    <>
      <Toaster position="top-right" />
      <div>
        <h1 className="text-h-2 text-primary-7740 mb-2">Programación Académica</h1>
        {academicSchedule && selectedPensumNames && (
          <p className="text-gray-700 mb-6">
            <b>Programación académica:</b> {selectedPensumNames} — Semestre {academicSchedule.semester || "No especificado"}
          </p>
        )}
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <ModalPensums
            setPensums={setSelectedPensumsIds}
            action="create"
            onOpenSchedule={handleOpenSchedule}
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
              onOpenSchedule={handleOpenSchedule}
              text={"Importar Aulas DRAI"}
              setAction={setAction}
              isFromDrai={true}
              setImportType={setImportType}
              setFile={setFile}
            />
          )}
          {groups.length > 0 && <DataAnalysis action="ANALYSIS" />}
        </div>
        {academicSchedule && (
          <Button color="secondary" onPress={() => handleMarkMirrorGroups()}>
            Marcar espejos
          </Button>
        )}
      </div>

      <ModalSchedule
        setAcademicSchedule={setAcademicSchedule}
        selectedPensumsIds={selectedPensumsIds}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        action={action}
        importType={importType}
        file={file}
        onDone={() => setCanQuery(true)}
      />
      {showOverlay && (
          <div className="flex flex-col items-center justify-center mt-2 mb-2 space-y-2">
            <ClipLoader color="#4A5568" size={60} />
            <p className="text-gray-600 text-sm text-center">Cargando programación académica...</p>
          </div>
        )}
      <div className="mt-4 relative">
        {showTable && (
          <CustomDataGrid
            data={[...displayRows].sort((a: any, b: any) => a.subjectLevel - b.subjectLevel)}
            checkbox
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
                    onOpenChangeUpdateClassroom={onOpenUpdateClassroom}
                  />
                ),
              },
            ]}
            onSelectionChange={(keys) => {
              if (keys === "all") {
                setSelectedGroupIds(displayRows.map((g: any) => g.id));
              } else {
                const numericIds = Array.from(keys as Set<string>).map((k) => Number(k));
                setSelectedGroupIds(numericIds);
              }
            }}
            selectedKeys={new Set(selectedGroupIds.map(String))}
            total={data?.total ?? displayRows.length}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(n) => {
              setPageSize(n);
              setPage(0);
            }}
            loading={false}
          />
        )}

        
      </div>

      {selectedGroupId && (
        <ModalUpdateClassroom
          isOpen={isOpenUpdateClassroom}
          onOpenChange={onOpenChangeUpdateClassroom}
          groupId={selectedGroupId}
          onUpdated={() => setUpdated(true)}
        />
      )}

      {selectedGroupId && (
        <ModalUpdateGroupsSchedule
          onOpenChange={onOpenChangeUpdateSchedule}
          isOpen={isOpenUpdateSchedule}
          selectedGroupId={selectedGroupId}
        />
      )}
      
      {selectedGroup && selectedGroupId && (
				<ModalUpdateGroup
					isOpen={isOpenUpdate}
					onOpenChange={onOpenChangeUpdate}
					selectedGroup={selectedGroup}
					groupId={selectedGroupId}
					setUpdated={setUpdated} />
			)}

      {displayRows.length > 0 && <DataAnalysis action="EXPORT" />}
    </>
  );
};

export default Page;
