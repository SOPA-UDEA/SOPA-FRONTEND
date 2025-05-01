'use client';
import { useEffect, useState } from "react"
import { Subject } from "../interface/Subject";


export const useFetchSubjetcByPensum = (id: number) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubject, setLoading] = useState(true);
  
  const fetchSubjects = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/subject/by_pensum/${id}`)
      const data = await response.json()
      setSubjects(data.subjects)

    } catch (error) {
      console.error("Error fetching subjects:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
        setLoading(true)
        fetchSubjects(id)
    }
    }, [id])


    return {
        subjects,
        loadingSubject
    }

  }



  
