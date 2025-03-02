import { Briefcase } from "lucide-react"

const JobPortalPreview = () => {
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-4">
                <Briefcase className="inline mr-2" /> Job Portal
            </h2>
            <div className="border p-4 rounded-lg">
                <h3 className="text-xl font-semibold">Available Internships</h3>
                <ul>
                    <li>AI Research Internship</li>
                    <li>Frontend Development Internship</li>
                </ul>
            </div>
        </div>
    )
}

export default JobPortalPreview
