import { useForm } from "@/hooks/useForm";
import { AcademicSchedule } from "@/interface/AcademicSchedule";
import { Form, Button, Input } from "@heroui/react";

interface Props{
    onSubmitForm: (e: React.FormEvent<HTMLFormElement>, formState: AcademicSchedule) => void;
}

export default function FormAcademicSchedule( { onSubmitForm }:Props) {
    const initialFormState = {
      semester: ''
    };

    const {formState, onInputChange, onResetForm, } = useForm(initialFormState);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        onSubmitForm(e, formState);
        onResetForm();
    }

    return(
        <Form onSubmit={ handleSubmit }>
            {Object.entries(formState).map(([key, value]) => (
            <Input
                key={key}
                name={key}
                label={key}
                value={value}
                labelPlacement="outside"
                onChange={onInputChange}
                isRequired
            />
            ))}
            <div className="flex flex-wrap gap-4 items-center">
                <Button color="secondary" type="submit">
                    Crear
                </Button>
                <Button
                    color="default"
                    type="button"
                    onPress={onResetForm}
                    className="bg-red-500 text-white"
                >
                    Borrar
                </Button>
            </div>
        </Form>
    )
}