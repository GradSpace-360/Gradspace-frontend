"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
    ChevronDown,
    ChevronUp,
    Code,
    FlaskConical,
    Linkedin,
    Server,
} from "lucide-react"
import { useState } from "react"

import Github from "@/assets/github.svg"
import DotBackground from "@/components/DotBackground"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Developer {
    name: string
    role: string
    summary: string
    experience: string
    skills: string[]
    linkedin: string
    github: string
    icon: JSX.Element
}

const developers: Developer[] = [
    {
        name: "Sujith T S",
        role: "Frontend Developer",
        summary:
            "Passionate about creating intuitive and responsive user interfaces using React.js and TypeScript.",
        experience: "2+ years of experience in frontend development",
        skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        linkedin: "https://www.linkedin.com/in/07sujithts/",
        github: "https://github.com/07SUJITH",
        icon: <Code className="w-6 h-6" />,
    },
    {
        name: "Jelan Mathew James",
        role: "Backend Developer",
        summary:
            "Skilled in building robust and scalable backend systems using Golang, Python, and various web frameworks.",
        experience: "3+ years of experience in backend development",
        skills: ["Golang", "Python", "Docker", "Kubernetes"],
        linkedin: "https://www.linkedin.com/in/jelan-mathew-james-571490220/",
        github: "https://github.com/jelanmathewjames",
        icon: <Server className="w-6 h-6" />,
    },
    {
        name: "Joel Siby Varghese",
        role: "Quality Assurance Tester",
        summary:
            "Dedicated to ensuring product quality through comprehensive testing strategies",
        experience: "1+ years of experience in software testing",
        skills: ["Selenium", "Jest", "Cypress", "Postman"],
        linkedin: "https://www.linkedin.com/in/joel-siby-varghese-7656a2261/",
        github: "https://github.com/joelsibyvarghese",
        icon: <FlaskConical className="w-6 h-6" />,
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
        },
    },
}

export default function DevInfo() {
    return (
        <motion.div
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <DotBackground />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.h1
                    className="text-4xl font-bold font-philosopher text-center mb-12 text-gray-900 dark:text-white"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Meet Our Development Team
                </motion.h1>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {developers.map((dev) => (
                        <DeveloperCard key={dev.name} dev={dev} />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    )
}

function DeveloperCard({ dev }: { dev: Developer }) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <motion.div
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className="p-6">
                <motion.div
                    className="flex items-center mb-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        {dev.icon}
                    </motion.div>
                    <h2 className="ml-2 text-2xl font-philosopher font-semibold text-gray-900 dark:text-white">
                        {dev.name}
                    </h2>
                </motion.div>
                <p className="text-lg font-medium text-primary mb-2">
                    {dev.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {dev.summary}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {dev.experience}
                </p>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    Skills:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {dev.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <motion.div whileHover={{ y: -5 }}>
                            <a
                                href={dev.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                                <Linkedin className="w-6 h-6" />
                            </a>
                        </motion.div>
                        <motion.div whileHover={{ y: -5 }}>
                            <a
                                href={dev.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
                            >
                                <img
                                    src={Github}
                                    alt="github"
                                    className="w-6 h-6"
                                />
                            </a>
                        </motion.div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
