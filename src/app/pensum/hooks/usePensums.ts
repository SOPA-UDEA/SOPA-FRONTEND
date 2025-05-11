import { useQuery } from "@tanstack/react-query";
import { getPensums } from "@/services/pensumService";

export const usePensums = () => {
  const {
    data: pensums = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pensums"],
    queryFn: getPensums,
  });

  return {
    pensums,
    isLoading,
    isError,
    error,
  };
};