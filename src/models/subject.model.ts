export interface SubjectModel {
    subjectId: number
    name: string
    acronyms: string
    permalink: string
    finalExamMax: number
    firstMidtermMax: number
    secondMidtermMax: number
    lang: 'sr' | 'en'
    createdAt: string
    updatedAt: string
}