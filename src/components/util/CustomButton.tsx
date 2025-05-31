import { Button } from "@heroui/react";

interface Props {
    onPress: () => void;
    children: React.ReactNode;
}

export default function CustomButton({ onPress, children }: Props) {
  return (
    <Button onPress={onPress}
        className="capitalize min-w-[200px] md:min-w-[250px] justify-start text-left /* Ancho y alineación */
                   border border-neutral-50 hover:border-primary-361                /* Borde y hover del borde */
                   text-primary-7740                                                 /* Color del texto (tu verde) */
                   dark:border-neutral-500/50 dark:hover:border-primary-361
                   dark:text-primary-361                                             /* Color de texto en modo oscuro */
                   bg-neutral-100 dark:bg-neutral-1000                                /* Fondo blanco/oscuro */
                   hover:bg-primary-361/5 dark:hover:bg-primary-361/10              /* Fondo sutil en hover (opacidad más baja) */
                   focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-361 focus:ring-offset-background /* Estilos de foco */
                   px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-150 mb-6"
    >
      {children}
      
    </Button>
  );
}
