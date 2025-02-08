import { create } from "zustand"

import { AddUserStore } from "@/types/admin/AddUser"

export const useAddUserStore = create<AddUserStore>((set) => ({
    activeAccordion: "add-via-excel",
    setActiveAccordion: (accordion) => set({ activeAccordion: accordion }),
    parsedExcelData: [],
    setParsedExcelData: (data) => set({ parsedExcelData: data }),
}))
