import { AcademicProgram } from "../interface/AcademicProgram";
import { useEffect, useState } from "react";


export const useFetchAcademicProgram = () => {
  const [academicPrograms, setAcademicProgram] = useState<AcademicProgram[]>([]);
  const [loading, setLoading] = useState(true)

  const fetchAcademicProgram = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/academic_program/lists`)
      const data = await response.json()
      setAcademicProgram(data.academic_program)
      
    } catch (error) {
        console.error("Error fetching academic program:", error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchAcademicProgram()
  }, [])

  return {
    academicPrograms,
    loading,
  }
 
}
