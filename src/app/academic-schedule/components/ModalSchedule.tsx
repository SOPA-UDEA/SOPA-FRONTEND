// import { CustomNotification } from "@/components/util/CustomNotification";
import { Modal, ModalBody, ModalHeader, ModalContent } from '@heroui/react'
import { ClipLoader } from 'react-spinners';
import { AcademicSchedule, AcademicScheduleResponse } from "@/interface/AcademicSchedule";
import FormAcademicSchedule from "./formAcademicSchedule";
import useCreateAcademicSchedule, { useGetAcademicScheduleBySemester } from '@/hooks/useSchedule';
import { useCreateBaseGroup } from '@/hooks/useGroups';
import { useUpdateExcel, useUploadExcel } from '@/hooks/useGroupClassroom';
import { GroupClassroomDrai } from '@/interface/GroupClassroom';

interface FormProps {
	setAcademicSchedule: (a: AcademicScheduleResponse) => void;
	selectedPensumsIds: number[];
	onOpenChange: (isOpen: boolean) => void;
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
	const { mutateAsync: updateExcel, isPending: isPendingUpdate } = useUpdateExcel();

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
						onOpenChange(false);
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
				const request: GroupClassroomDrai = {
					semester: formState.semester,
					pensumId: selectedPensumsIds[0],
					file: file as File
				};
				uploadExcel(request, {
					onSuccess: async () => {
						const academicSchedule = await getAcademicScheduleBySemester(formState.semester);
						onOpenChange(false);
						setAcademicSchedule(academicSchedule);
					}
				});
			}
			if (importType === "UPDATE") {
				console.log("Updating groups from DRAI");
				const request: GroupClassroomDrai = {
					semester: formState.semester,
					pensumId: selectedPensumsIds[0],
					file: file as File
				};
				updateExcel(request, {
					onSuccess: async () => {
						const academicSchedule = await getAcademicScheduleBySemester(formState.semester);
						onOpenChange(false);
						setAcademicSchedule(academicSchedule);
					}
				});
			}

		}

	};

	const handleIsLoading = () => {
		return isPending || isPendingUpdate;
	}

	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={() => {
					if (!isPending) {
						onOpenChange(!isOpen);
					}
				}}
			>
				<ModalContent>
					{() => {
						return (
							<>
								<ModalHeader className="flex flex-col gap-1">
									{handleIsLoading() ? "Cargando..." : "Semestre Académico"}
								</ModalHeader>
								<ModalBody>
									{!handleIsLoading() && (
										<FormAcademicSchedule onSubmitForm={handleSubmit} />
									)}
									{handleIsLoading() && (
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
