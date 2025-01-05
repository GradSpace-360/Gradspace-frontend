/**
 * SocialStep Component
 *
 * Manages the social media and link input step in the onboarding process.
 * Allows users to add and validate their social media profiles and other relevant links.
 * Utilizes React Hook Form for form management, Framer Motion for animations,
 * and lodash's debounce for input validation.
 */

import { motion } from "framer-motion"
import debounce from "lodash/debounce"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOnboardingStore } from "@/store/onboard"
import { SocialLinks } from "@/types/onboard"
import { validateUrl } from "@/utils/onboard"

export function SocialStep() {
    const { formData, setFormData, setStep } = useOnboardingStore()
    const [localErrors, setLocalErrors] = useState<
        Partial<Record<keyof SocialLinks, string>>
    >({})

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm<SocialLinks>({
        defaultValues: formData.socialLinks,
        mode: "onBlur",
    })

    // Validate URL and set local errors
    // components/onboarding/SocialStep.tsx

    const validateUrlField = useCallback(
        (value: string, fieldName: keyof SocialLinks) => {
            const error = validateUrl(value)
            setLocalErrors((prev) => ({
                ...prev,
                [fieldName]: error || undefined,
            }))
            return error === null // Return true if valid, false if invalid
        },
        []
    )

    const debouncedValidation = debounce((name: keyof SocialLinks) => {
        trigger(name)
    }, 300)

    const onSubmit = (data: SocialLinks) => {
        setFormData({ socialLinks: data })
        setStep(5)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-philosopher font-bold">
                    Social Media & Links
                </h2>
                <p className="text-muted-foreground">
                    Add your social media profiles and links (optional)
                </p>
            </div>

            <Card>
                <CardContent className="pt-5">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {Object.entries({
                            github: "GitHub Profile",
                            linkedin: "LinkedIn Profile",
                            instagram: "Instagram Profile",
                            website: "Personal Website",
                            resume: "Resume Drive Link",
                        }).map(([key, label]) => (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key}>{label}</Label>
                                <Input
                                    id={key}
                                    type="url"
                                    placeholder={`https://${key}.com/username`}
                                    {...register(key as keyof SocialLinks, {
                                        validate: (value) =>
                                            validateUrlField(
                                                value,
                                                key as keyof SocialLinks
                                            ),
                                        onChange: () =>
                                            debouncedValidation(
                                                key as keyof SocialLinks
                                            ),
                                    })}
                                />
                                {(errors[key as keyof SocialLinks] ||
                                    localErrors[key as keyof SocialLinks]) && (
                                    <p className="text-sm text-red-500">
                                        {errors[key as keyof SocialLinks]
                                            ?.message ||
                                            localErrors[
                                                key as keyof SocialLinks
                                            ]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </form>
                </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(3)}
                >
                    Previous
                </Button>
                <Button type="submit" onClick={handleSubmit(onSubmit)}>
                    Next Step
                </Button>
            </div>
        </motion.div>
    )
}
