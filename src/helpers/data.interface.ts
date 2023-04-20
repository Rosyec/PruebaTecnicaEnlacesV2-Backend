export interface UserRegister {
    _id?: string
    name: string,
    email: string,
    password: string
}

export interface JWT {
    email: string,
}

export interface Userlogin {
    email: string,
    password: string
}

export interface Post {
    title: string,
    content: string,
    
}

export interface Querys {
    id: string
}

export interface Params {
    id: string
}