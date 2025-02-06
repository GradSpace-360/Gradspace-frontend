export type Experience = {
    companyName: string;
    position: string;
    startDate: Date;
    endDate: Date | "Present";
    jobType: "Full-time" | "Part-time" | "Internship" | "Freelance";
    locationType: "Remote" | "Onsite" | "Hybrid";
    location: string;
};

export type SocialLinks = {
    github: string;
    instagram: string;
    linkedin: string;
    website: string;
    resume: string;
};

export type Education = {
    institutionName: string;
    course: string;
    location: string;
    startDate: Date;
    endDate: Date;
    grade: string;
};

export type OnboardingState = {
    step: number;
    formData: {
        profileImage: ArrayBuffer | null;
        headline: string;
        about: string;
        location: string;
        skills: string[];
        interests: string[];
        education: Education[];
        experience: Experience[];
        socialLinks: SocialLinks;
    };
};

export type OnboardingStore = OnboardingState & {
    setStep: (step: number) => void;
    setFormData: (data: Partial<OnboardingState["formData"]>) => void;
    reset: () => void;
    submitFormData: () => Promise<void>;
};