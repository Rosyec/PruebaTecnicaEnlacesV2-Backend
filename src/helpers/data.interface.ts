export interface UserRegister {
    name: string,
    email: string,
    password: string
}

export interface Userlogin {
    email: string,
    password: string
}

export interface Post {
    id: string,
    title: string,
    description: string,
    author: string,
    authorId: string,
    
}

export interface Querys {
    id: string
}