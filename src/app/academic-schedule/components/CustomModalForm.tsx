// import { CustomNotification } from "@/components/util/CustomNotification";
import { Modal, ModalBody, ModalHeader,  ModalContent } from '@heroui/react'
import { AcademicSchedule, AcademicScheduleResponse } from "@/interface/AcademicSchedule";
import FormAcademicSchedule from "./formAcademicSchedule";
import useCreateAcademicSchedule from '@/hooks/useSchedule';
import { useCreateBaseGroup } from '@/hooks/useGroups';


interface FormProps{
    setAcademicSchedule: (a: AcademicScheduleResponse) => void;
    selectedPensumsIds: number[];
    onOpenChange: () => void;
    isOpen: boolean;
}

export const CustomModalForm = ({ setAcademicSchedule, selectedPensumsIds, onOpenChange, isOpen  }: FormProps) => {

    const { mutate } = useCreateAcademicSchedule();
	const { mutateAsync } = useCreateBaseGroup();
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>, formState: AcademicSchedule) => {
        event.preventDefault();
        const scheduleRequest = {
			'semester': formState.semester,
			'pensumsIds': selectedPensumsIds
        }
        mutate( scheduleRequest ,
            {
				onSuccess: (data) => {
					onOpenChange();
					const requestBase = {
						'scheduleId': data.id,
						'pensumIds': selectedPensumsIds
					}
					mutateAsync( requestBase )
					setAcademicSchedule(data);
				},
				onError: () => {
					// onOpenChange();
				},
            }
        )
    };

  	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{() => {
						return (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Nueva Programación académica
							</ModalHeader>
							<ModalBody>
								<FormAcademicSchedule onSubmitForm={ handleSubmit } />
							</ModalBody>
						</>
						);
					}}
				</ModalContent>
			</Modal>
		</>
  	)
}
