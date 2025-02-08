export interface User {
    fullName: string
    batch: number
    department: "CSE" | "EEE" | "ECE" | "ME"
    role: "Student" | "Alumni" | "Faculty"
    email: string
}

export interface AddUserStore {
    activeAccordion: "add-via-excel" | "add-manually" | "promote-batch"
    setActiveAccordion: (accordion: AddUserStore["activeAccordion"]) => void
    parsedExcelData: User[]
    setParsedExcelData: (data: User[]) => void
}
