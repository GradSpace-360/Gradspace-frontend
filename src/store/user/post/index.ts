import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"

type Comment = {
    id: string
    content: string
    createdAt: Date
    author: {
        id: string
        username: string
        image?: string
    }
}

type Post = {
    id: string
    content: string
    image?: string
    createdAt: Date
    author: {
        id: string
        username: string
        image?: string
    }
    comments: number
    likes: number
    isLiked: boolean
    commentList: Comment[] | []
}

type Meta = {
    current_page: number
    per_page: number
    total_pages: number
    total_items: number
}
type PostResponse = {
    data: Post[]
    meta: Meta
}

type PostStore = {
    homePosts: Post[]
    userPosts: Post[]
    homePage: number
    userPage: number
    homeLoading: boolean
    userLoading: boolean
    homeHasMore: boolean
    userHasMore: boolean
    error: string | null
    fetchPosts: (initial?: boolean) => Promise<void>
    createPost: (content: string, image: File | null) => Promise<void>
    toggleLike: (postId: string) => Promise<void>
    createComment: (postId: string, content: string) => Promise<void>
    fetchUserPosts: (username: string, initial?: boolean) => Promise<void>
    selectedPostId: string | null
    setSelectedPostId: (postId: string | null) => void
}

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            if (reader.result instanceof ArrayBuffer) {
                resolve(reader.result)
            } else {
                reject(
                    new Error("Failed to read the image file as binary data.")
                )
            }
        }
        reader.onerror = () =>
            reject(new Error("Failed to read the image file."))
        reader.readAsArrayBuffer(file)
    })
}

export const usePostStore = create<PostStore>((set, get) => ({
    homePosts: [],
    userPosts: [],
    homePage: 1,
    userPage: 1,
    homeLoading: false,
    userLoading: false,
    homeHasMore: true,
    userHasMore: true,
    error: null,
    selectedPostId: null,

    setSelectedPostId: (postId) => set({ selectedPostId: postId }),

    fetchPosts: async (initial = false) => {
        const { homePage, homePosts, homeHasMore, homeLoading } = get()
        if (homeLoading || !homeHasMore) return

        set({ homeLoading: true })
        try {
            const targetPage = initial ? 1 : homePage + 1
            const res = await axiosPrivate.get(
                `/posts/?page=${targetPage}&limit=10`
            )
            const { data, meta } = res.data as PostResponse
            const processedData = data.map((post) => ({
                ...post,
                commentList: post.commentList || [],
            }))

            if (initial) {
                set({
                    homePosts: processedData,
                    homePage: 1,
                    homeHasMore: meta.total_pages > 1,
                })
            } else {
                set({
                    homePosts: [...homePosts, ...processedData],
                    homePage: targetPage,
                    homeHasMore: meta.current_page < meta.total_pages,
                })
            }
        } catch {
            set({ error: "Failed to load posts" })
        } finally {
            set({ homeLoading: false })
        }
    },

    fetchUserPosts: async (username, initial = false) => {
        if (initial) {
            set({
                userPosts: [],
                userPage: 1,
                userHasMore: true,
                error: null,
            })
        }
        const { userPage, userPosts, userHasMore, userLoading } = get()
        if (userLoading || !userHasMore) return
        if (initial) {
            set({
                userPosts: [],
                userPage: 1,
                userHasMore: true,
            })
        }

        set({ userLoading: true })
        try {
            const targetPage = initial ? 1 : userPage + 1
            const res = await axiosPrivate.get(
                `/posts/user/${username}?page=${targetPage}&limit=10`
            )
            const { data, meta } = res.data as PostResponse
            const processedData = data.map((post) => ({
                ...post,
                commentList: post.commentList || [],
            }))

            if (initial) {
                set({
                    userPosts: processedData,
                    userPage: 1,
                    userHasMore: meta.total_pages > 1,
                })
            } else {
                set({
                    userPosts: [...userPosts, ...processedData],
                    userPage: targetPage,
                    userHasMore: meta.current_page < meta.total_pages,
                })
            }
        } catch {
            set({ error: "Failed to load posts" })
        } finally {
            set({ userLoading: false })
        }
    },

    createPost: async (content, image) => {
        const formData = new FormData()
        formData.append("content", content)

        try {
            if (image) {
                const arrayBuffer = await readFileAsArrayBuffer(image)
                const blob = new Blob([new Uint8Array(arrayBuffer)], {
                    type: image.type,
                })
                formData.append("image", blob, image.name)
            }

            const res = await axiosPrivate.post("/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            const newPost = res.data.data
            set((state) => ({
                homePosts: [
                    {
                        ...newPost,
                        commentList: [],
                    },
                    ...state.homePosts,
                ],
            }))
        } catch {
            set({ error: "Failed to create post" })
        }
    },

    toggleLike: async (postId) => {
        try {
            await axiosPrivate.post(`/posts/${postId}/like`)
            set((state) => ({
                homePosts: state.homePosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              likes: post.isLiked
                                  ? post.likes - 1
                                  : post.likes + 1,
                              isLiked: !post.isLiked,
                          }
                        : post
                ),

                userPosts: state.userPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              likes: post.isLiked
                                  ? post.likes - 1
                                  : post.likes + 1,
                              isLiked: !post.isLiked,
                          }
                        : post
                ),
            }))
        } catch {
            set({ error: "Failed to toggle like" })
        }
    },

    createComment: async (postId, content) => {
        try {
            const res = await axiosPrivate.post(`/posts/${postId}/comment`, {
                content,
            })
            const newComment = res.data.data

            set((state) => ({
                homePosts: state.homePosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              comments: post.comments + 1,
                              commentList: [...post.commentList, newComment],
                          }
                        : post
                ),
                userPosts: state.userPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              comments: post.comments + 1,
                              commentList: [...post.commentList, newComment],
                          }
                        : post
                ),
            }))
        } catch {
            set({ error: "Failed to create comment" })
        }
    },
}))
