import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
    onCancel: () => void
    onSubmit: () => void
}

export const ActionButtons = ({ onCancel, onSubmit }: ActionButtonsProps) => (
    <div className="flex gap-4 justify-end pt-6">
        <Button onClick={onCancel} variant="outline">
            Cancel
        </Button>
        <Button onClick={onSubmit}>Save Changes</Button>
    </div>
)
