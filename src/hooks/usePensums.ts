import { useQuery } from "@tanstack/react-query";
import { getPensums, getPensumsById } from "@/services/pensumService";

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

export function usePensumById(pensumId: number | undefined) {
  return useQuery({
    queryKey: ["pensum", pensumId],
    queryFn: () => {
      if (pensumId === undefined) {
        throw new Error("pensumId is undefined");
      }
      return getPensumsById(pensumId);
    },
    enabled: pensumId != 0 && pensumId != undefined
  });
}