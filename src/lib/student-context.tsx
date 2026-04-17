"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { getStudentsForParent } from "@/app/actions/student-actions"

type StudentData = {
  id: string
  name: string
  grade: string | null
  xp: number
  avatar: string | null
  interests: string[]
}

type StudentContextType = {
  students: StudentData[]
  selectedStudent: StudentData | null
  setSelectedStudentId: (id: string) => void
  loading: boolean
}

const StudentContext = createContext<StudentContextType>({
  students: [],
  selectedStudent: null,
  setSelectedStudentId: () => {},
  loading: true,
})

export function StudentProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [students, setStudents] = useState<StudentData[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return
    setLoading(true)
    getStudentsForParent(session.user.id).then((data) => {
      setStudents(data)
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id)
      }
      setLoading(false)
    })
  }, [session?.user?.id])

  const selectedStudent = students.find((s) => s.id === selectedId) ?? null

  return (
    <StudentContext.Provider
      value={{
        students,
        selectedStudent,
        setSelectedStudentId: setSelectedId,
        loading,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  return useContext(StudentContext)
}
