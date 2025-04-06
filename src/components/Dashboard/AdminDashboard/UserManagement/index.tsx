import AddUser from "@/components/Dashboard/AdminDashboard/UserManagement/AddUsers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import ViewUpdate from "./ViewUpdateUsers"

const UserManagementPage: React.FC = () => {
    return (
        <div className="pt-6 px-3 sm:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold font-philosopher  text-xl overflow-hidden whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    User Management
                </h1>
            </div>

            <Tabs defaultValue="view-update" className="w-full p-0 ">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                    <TabsTrigger value="view-update">view-update</TabsTrigger>
                    <TabsTrigger value="add-user">add-user</TabsTrigger>
                </TabsList>
                <div className="mt-6 ">
                    <TabsContent value="view-update">
                        <ViewUpdate />
                    </TabsContent>
                    <TabsContent value="add-user">
                        <AddUser />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default UserManagementPage
