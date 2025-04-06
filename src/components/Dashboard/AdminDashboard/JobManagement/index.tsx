import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import CompanyManagement from "./CompanyManagement"
import JobModeration from "./JobModeration"

// Main Job Management Page
const JobManagementPage = () => {
    return (
        <div className="pt-6 px-3 sm:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold font-philosopher  text-xl overflow-hidden whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Job Management
                </h1>
            </div>

            <Tabs defaultValue="job-moderation" className="w-full">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                    <TabsTrigger value="job-moderation">
                        Job Moderation
                    </TabsTrigger>
                    <TabsTrigger value="company-management">
                        Company Management
                    </TabsTrigger>
                </TabsList>
                <div className="mt-6">
                    <TabsContent value="job-moderation">
                        <JobModeration />
                    </TabsContent>
                    <TabsContent value="company-management">
                        <CompanyManagement />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default JobManagementPage
