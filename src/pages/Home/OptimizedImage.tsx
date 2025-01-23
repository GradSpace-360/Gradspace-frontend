import { useEffect, useState } from "react"

interface OptimizedImageProps {
    src: string
    alt: string
    className?: string
}

export default function OptimizedImage({
    src,
    alt,
    className,
}: OptimizedImageProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null)

    useEffect(() => {
        const img = new Image()
        img.src = src
        img.onload = () => setImageSrc(src)
    }, [src])

    if (!imageSrc) {
        return <div className={`${className} bg-gray-200 animate-pulse`} />
    }

    return (
        <img
            src={imageSrc || "/placeholder.svg"}
            alt={alt}
            className={className}
        />
    )
}
