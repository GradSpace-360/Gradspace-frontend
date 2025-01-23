import React from "react"

import pageNotFoundImg from "@/assets/pagenotfound.svg"

const PageNotFound: React.FC = () => {
    return (
        <div className="flex h-screen justify-center items-center">
            <img
                className="object-contain h-96"
                src={pageNotFoundImg}
                alt="Page not found"
            />
        </div>
    )
}
export default PageNotFound
