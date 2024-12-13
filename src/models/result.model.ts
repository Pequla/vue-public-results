import { SubjectModel } from "./student.model"
import { StudentModel } from "./subject.model"

export interface ResultModel {
    studentSubjectId: number
    studentId: number
    student: StudentModel
    subjectId: number
    subject: SubjectModel
    firstMidterm: number | null
    secondMidterm: number | null
    finalExam: number | null
    attendanceLectures: number | null
    attendanceExcercises: number | null
    mark: {
        value: number
        points: number
        style: string
    }
    note: string | null,
    createdAt: string,
    updatedAt: string | null,
    lockedAt: string | null
}