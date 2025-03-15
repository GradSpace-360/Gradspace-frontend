import { Button } from "@/components/ui/button"

export function EmptyState({ onStartChat }: { onStartChat?: () => void }) {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="text-center">
                <div className="mb-4">
                    <div className="mx-auto h-20 w-20 rounded-full dark:bg-zinc-800 bg-zinc-300 flex items-center justify-center">
                        <svg
                            className="h-10 w-10 text-zinc-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4-4-4z"
                            />
                        </svg>
                    </div>
                </div>
                <h3 className="text-xl font-medium dark:text-zinc-300 text-zinc-600">
                    Your messages
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                    Send a message to start a chat
                </p>
                <Button onClick={onStartChat} className="mt-4 px-4 py-2">
                    Send Message
                </Button>
            </div>
        </div>
    )
}
