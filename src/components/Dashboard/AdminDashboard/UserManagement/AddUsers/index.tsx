/**
 * AddUserComponent
 *
 * This component provides an interface for administrators to add users to the system
 * through multiple methods: manually, via Excel upload, or by promoting a batch of students
 * to alumni status. It uses an accordion layout to organize the different methods.
 * Features:
 * - Accordion-based navigation for switching between methods:
 *   - Add users via Excel upload.
 *   - Add users manually.
 *   - Promote a batch of students to alumni status.
 * - Smooth animations for transitioning between accordion sections using `framer-motion`.
 * - State management for tracking the active accordion section.
 */

import { AnimatePresence, motion } from "framer-motion"
import React from "react"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useAddUserStore } from "@/store/admin/addUserStore"
import { AddUserStore } from "@/types/admin/AddUser"

import AddManually from "./AddManually"
import AddViaExcel from "./AddViaExcel"
import PromoteBatch from "./PromoteBatch"

const AddUserComponent: React.FC = () => {
    const { activeAccordion, setActiveAccordion } = useAddUserStore()
    return (
        <div className=" mx-auto p-4 sm:p-6 lg:p-8">
            <Accordion
                type="single"
                value={activeAccordion}
                onValueChange={(value) =>
                    setActiveAccordion(value as AddUserStore["activeAccordion"])
                }
            >
                <AccordionItem value="add-via-excel">
                    <AccordionTrigger>Add via Excel</AccordionTrigger>
                    <AccordionContent>
                        <AnimatePresence mode="wait">
                            {activeAccordion === "add-via-excel" && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <AddViaExcel />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="add-manually">
                    <AccordionTrigger>Add Manually</AccordionTrigger>
                    <AccordionContent>
                        <AnimatePresence mode="wait">
                            {activeAccordion === "add-manually" && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <AddManually />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="promote-batch">
                    <AccordionTrigger>Promote Batch</AccordionTrigger>
                    <AccordionContent>
                        <AnimatePresence mode="wait">
                            {activeAccordion === "promote-batch" && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <PromoteBatch />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default AddUserComponent
