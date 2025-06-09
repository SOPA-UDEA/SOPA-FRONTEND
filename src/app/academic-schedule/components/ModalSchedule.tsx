// import { CustomNotification } from "@/components/util/CustomNotification";
import { Modal, ModalBody, ModalHeader, ModalContent } from '@heroui/react'
import { ClipLoader } from 'react-spinners';
import { AcademicSchedule, AcademicScheduleResponse } from "@/interface/AcademicSchedule";
import FormAcademicSchedule from "./formAcademicSchedule";
import useCreateAcademicSchedule, { useGetAcademicScheduleBySemester } from '@/hooks/useSchedule';
import { useCreateBaseGroup, useGroupsBySchedulePensum } from '@/hooks/useGroups';
import { useUploadExcel } from '@/hooks/useGroupClassroom';
import { GroupClassroomDraiUpload } from '@/interface/GroupClassroom';

interface FormProps {
	setAcademicSchedule: (a: AcademicScheduleResponse) => void;
	selectedPensumsIds: number[];
	onOpenChange: () => void;
	isOpen: boolean;
	action: string;
	importType: "CREATE" | "UPDATE";
	file: File | null;
}

export const ModalSchedule = ({ setAcademicSchedule, selectedPensumsIds,
	onOpenChange, isOpen, action, importType, file }: FormProps) => {

	const { mutate } = useCreateAcademicSchedule();
	const { mutateAsync: getAcademicScheduleBySemester } = useGetAcademicScheduleBySemester()
	const { mutateAsync } = useCreateBaseGroup();
	const { mutateAsync: uploadExcel, isPending } = useUploadExcel();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>, formState: AcademicSchedule) => {
		event.preventDefault();
		const scheduleRequest = {
			'semester': formState.semester,
			'pensumsIds': selectedPensumsIds
		}
		console.log(selectedPensumsIds);
		console.log(formState.semester);

		if (action === "create") {
			mutate(scheduleRequest,
				{
					onSuccess: (data) => {
						onOpenChange();
						const requestBase = {
							'scheduleId': data.id,
							'pensumIds': selectedPensumsIds
						}
						mutateAsync(requestBase)
						setAcademicSchedule(data);
					},
					onError: () => {
						// onOpenChange();
					},
				}
			)
		} else if (action === "drai") {
			//Uploading or Updating groups from DRAI
			if (importType === "CREATE") {
				console.log("Creating groups from DRAI");
				const request: GroupClassroomDraiUpload = {
					semester: formState.semester,
					pensumId: selectedPensumsIds[0],
					file: file as File
				};
				uploadExcel(request, {
					onSuccess: async () => {
						const academicSchedule = await getAcademicScheduleBySemester(formState.semester);
						onOpenChange();
						setAcademicSchedule(academicSchedule);
					},
					onError: (error: unknown) => {
						console.error("Error uploading groups from DRAI:", error);
					}
				});
			}

		}

	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={() => {
					if (!isPending) {
						onOpenChange();
					}
				}}
			>
				<ModalContent>
					{() => {
						return (
							<>
								<ModalHeader className="flex flex-col gap-1">
									{isPending ? "Cargando..." : "Semestre Académico"}
								</ModalHeader>
								<ModalBody>
									{!isPending && (
										<FormAcademicSchedule onSubmitForm={handleSubmit} />
									)}
									{isPending && (
										<div className="flex flex-col items-center justify-center mt-2 mb-2 space-y-2">
											<ClipLoader color="#4A5568" size={30} />
											<p className="text-gray-600 text-sm text-center">
												Esta acción puede tomar algunos minutos.
											</p>
										</div>
									)}
								</ModalBody>
							</>
						);
					}}
				</ModalContent>
			</Modal>
		</>
	)
}
