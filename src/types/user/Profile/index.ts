export interface ProfileData {
    educations: Education[];
    experiences: Experience[];
    profile: Profile;
    socialLinks: SocialLinks;
    user: User;
}

export interface Education {
    course: string;
    endDate: string;
    grade: string;
    institutionName: string;
    location: string;
    startDate: string;
}

export interface Experience {
    companyName: string;
    endDate: string;
    jobType: string;
    location: string;
    locationType: string;
    position: string;
    startDate: string;
}

export interface Profile {
    about: string;
    headline: string;
    interests: string[];
    location: string;
    profileImage: ArrayBuffer | string | null;
    skills: string[];
}

export interface SocialLinks {
    github: string;
    instagram: string;
    linkedin: string;
    resume: string;
    website: string;
}

export interface User {
    batch: number;
    department: string;
    fullName: string;
    id: string;
    role: string;
    userName: string;
}