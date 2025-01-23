import { motion } from "framer-motion"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
    {
        name: "Sujith T S",
        class: "Class of 2021",
        testimonial:
            "GradSpace helped me find a mentor in my field. It's been invaluable for my career growth!",
        avatarFallback: "ST",
    },
    {
        name: "Jelan Mathew James",
        class: "Class of 2021",
        testimonial:
            "The networking opportunities on GradSpace are unparalleled. I've made connections that led to my dream job.",
        avatarFallback: "JM",
    },
    {
        name: "Joel Siby Varghese",
        class: "Class of 2021",
        testimonial:
            "As a recent graduate, GradSpace has been crucial in helping me navigate the job market and connect with alumni in my industry.",
        avatarFallback: "JS",
    },
]

export default function Testimonials() {
    return (
        <section id="testimonials" className="w-full py-20">
            <div className="container w-full flex flex-col px-4 md:px-6">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold font-philosopher tracking-tighter sm:text-5xl text-center"
                >
                    <span className="inline-block px-4 transform -skew-y-2 bg-violet-200 dark:bg-[#080909] font-bold font-philosopher">
                        <span className="transform skew-y-2 inline-block">
                            What Our Users Say
                        </span>
                    </span>
                </motion.h2>

                <motion.div className="grid gap-6 mt-6 items-stretch md:grid-cols-2 lg:grid-cols-3 md:max-w-full max-w-sm mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="h-full dark:bg-[#161716] bg-violet-50"
                        >
                            <CardContent className="flex flex-col items-center space-y-4 p-6 justify-between">
                                <Avatar className="w-16 h-16">
                                    <AvatarImage
                                        alt={testimonial.name}
                                        src="/placeholder.svg?height=64&width=64"
                                    />
                                    <AvatarFallback>
                                        {testimonial.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2 text-center">
                                    <h3 className="text-xl font-bold font-philosopher">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {testimonial.class}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        "{testimonial.testimonial}"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
