'use client';
import { useEffect, useState } from "react"
import { Pensum } from "../interface/Pensum";


export const useFetchPensums = () => {
    const [pensums, setPensums] = useState<Pensum[]>([]); 
    const [loading, setLoading] = useState(true)

    const fetchPensums = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/pensum/lists')
            const data = await response.json()
            setPensums(data.pensums)
        } catch (error) {
            console.error("Error fetching pensum:", error)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchPensums()
    }, [])

  return {
    pensums,
    loading
  }
}
