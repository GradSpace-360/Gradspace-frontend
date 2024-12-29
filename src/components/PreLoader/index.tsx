import { ScaleLoader } from "react-spinners"

const PreLoader = () => {
    const isDarkMode = document.documentElement.classList.contains("dark") // Detects dark mode
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#ffffef] dark:bg-black">
            <ScaleLoader color={isDarkMode ? "#fff" : "#000054"} />
        </div>
    )
}

export default PreLoader
