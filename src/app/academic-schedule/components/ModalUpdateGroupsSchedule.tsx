import { useForm } from "@/hooks/useForm";
import { Form, Button, Input, ModalContent, Modal, ModalBody, ModalHeader } from "@heroui/react";

interface Props {
    onOpenChange: () => void;
    isOpen: boolean;
}

export default function ModalUpdateGroupsSchedule({ onOpenChange, isOpen }: Props) {
    const initialFormState = {
        schedule: ''
    };

    const {formState, onInputChange, onResetForm, } = useForm(initialFormState);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        onResetForm();
    }

    const horarios = ["6-8", "8-10", "10-12", "12-14", "14-16", "16-18", "18-20", "20-22"];
    const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"];
    
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent className="w-auto max-w-fit">
                <ModalHeader className="flex flex-col gap-1 text-center">
                    Actualizar Horario
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={ handleSubmit }>
                        <div 
                        //className="overflow-x-auto"
                        >
                            <table className="table-auto border border-gray-300 text-center">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">Horas</th>
                                        {dias.map((dia) => (
                                            <th key={dia} className="border px-4 py-2">
                                                {dia}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {horarios.map((horas) => (
                                        <tr key={horas}>
                                            <td className="border px-4 py-2">{horas}</td>
                                            {dias.map((dia) => (
                                                <td key={`${horas}-${dia}`} className="border px-4 py-2">
                                                    <input
                                                    type="text"
                                                    name={`${dia}-${horas}`}
                                                    placeholder=""
                                                    className="w-full px-2 py-1 border rounded text-center"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> 
                        
                        <div className="flex flex-wrap gap-4 items-center">
                            <Button color="secondary" type="submit">
                                Actualizar
                            </Button>
                            <Button
                                color="default"
                                type="button"
                                onPress={onResetForm}
                                className="bg-red-500 text-white"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}