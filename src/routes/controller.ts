import { Response, Request, Router } from "express";
import { isValidObjectId } from "mongoose";
import { UserModel } from "../mongo/models/users.model";
import { PostModel } from "../mongo/models/post.model";
import {
  JWT,
  Params,
  Post,
  UserRegister,
  Userlogin,
} from "../helpers/data.interface";
import { authMiddleware, generateJWT } from "../helpers/jwt";

const router: Router = Router();

router.post('/generateJWT', async (req: Request<void, void, JWT>, resp: Response) => {
    const { email } = req.body;
    if (email.length === 0) {
      return resp.status(403).send('Se requiere el parametro name y email');
    }
    const token = await generateJWT( email );
    const data = {
      token
    }
    resp.status(200).json(data);
});

/**
 * * USERS
 */

router.post(
  "/users/login",
  authMiddleware,
  async (req: Request<void, void, Userlogin>, resp: Response) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      login(email, password, resp);
    } catch (error) {
      console.error(error);
      resp
        .status(500)
        .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
  }
);

async function login(email: string, mypassword: string, resp: Response) {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return resp.status(400).json({ message: "Credenciales inválidas" });
  }
  if (user.password !== mypassword) {
    return resp.status(400).json({ message: "Credenciales inválidas" });
  }
  const newUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    message: "Logeado correctamente",
  };
  resp.status(200).json(newUser);
}

router.post(
  "/users/register",
  async (req: Request<void, void, UserRegister>, resp: Response) => {
    try {
      register(req.body, resp);
    } catch (error) {
      console.error(error);
      resp
        .status(500)
        .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
  }
);

async function register(userRegister: UserRegister, resp: Response) {
  const { email, name, password } = userRegister;
  if (!email && !name && !password) {
    return resp
      .status(403)
      .send('Se requieren los parametros en el body "name, email y password"');
  }
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return resp
      .status(400)
      .json({ message: "Este correo electrónico ya está en uso" });
  }
  const user = new UserModel(userRegister);
  await user.save();
  const newUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    message: "Registrado correctamente",
  };
  return resp.status(201).json(newUser);
}

router.get("/users/:id", async (req: Request<Params>, resp: Response) => {
  try {
    getUserById(req.params.id, resp);
  } catch (error) {
    console.log(error);
    resp
      .status(500)
      .json({ message: "Ha ocurrido un error al procesar la solicitud" });
  }
});

async function getUserById(id: string, resp: Response) {
  if (!isValidObjectId(id)) {
    return resp.status(403).send('Se requiere el pathParam "id"');
  }
  const userById = await UserModel.findById({ _id: id });
  resp.json(userById);
}

/**
 * * POSTS
 */

router.get("/posts", async (req: Request, resp: Response) => {
  try {
    const userPosts = await PostModel.find();
    resp.json(userPosts);
  } catch (error) {
    console.log(error);
    resp
      .status(500)
      .json({ message: "Ha ocurrido un error al procesar la solicitud" });
  }
});

router.get("/posts/:id", async (req: Request<Params>, resp: Response) => {
  try {
    getPostById(req.params.id, resp);
  } catch (error) {
    console.log(error);
    resp
      .status(500)
      .json({ message: "Ha ocurrido un error al procesar la solicitud" });
  }
});

async function getPostById(id: string, resp: Response) {
  if (!isValidObjectId(id)) {
    return resp.status(403).send('Se requiere el pathParam "id"');
  }
  const postById = await PostModel.findById({ _id: id });
  resp.json(postById);
}

router.post(
  "/posts/:id",
  async (req: Request<Params, void, Post>, resp: Response) => {
    try {
      createPost(req.params.id, req.body, resp);
    } catch (err) {
      console.error(err);
      resp
        .status(500)
        .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
  }
);

async function createPost(id: string, post: Post, resp: Response) {
  const { title, content } = post;
  if (!isValidObjectId(id)) {
    return resp.status(403).send('Se requiere el pathParam "id"');
  }
  if (!title && !content) {
    return resp.status(403).send('Se requiere en el body "title y content"');
  }
  const newPost = new PostModel({ title, content, author: id });
  await newPost.save();
  resp.status(201).json(newPost);
}

router.put(
  "/posts/:id",
  async (req: Request<Params, void, Post>, resp: Response) => {
    try {
      updatePost(req.params.id, req.body, resp);
    } catch (error) {
      console.error(error);
      resp
        .status(500)
        .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
  }
);

async function updatePost(id: string, post: Post, resp: Response) {
  const { content, title } = post;
  if (!isValidObjectId(id)) {
    return resp.status(403).send('Se requiere el pathParam "id"');
  }
  if (!title && !content) {
    return resp.status(403).send('Se requiere en el body "title y content"');
  }
  const updatePost = await PostModel.findOne({ _id: id });
  if (!updatePost) {
    return resp.status(404).json({ message: "No se ha encontrado el post" });
  }
  updatePost.content = content;
  updatePost.title = title;
  await updatePost.save();
  resp.status(200).json(updatePost);
}

router.delete("/posts/:id", async (req: Request<Params>, resp: Response) => {
  try {
    deletePost(req.params.id, resp);
  } catch (error) {
    console.error(error);
    resp
      .status(500)
      .json({ message: "Ha ocurrido un error al procesar la solicitud" });
  }
});

async function deletePost(id: string, resp: Response) {
  if (!isValidObjectId(id)) {
    return resp.status(403).send('Se requiere el pathParam "id"');
  }
  const post = await PostModel.findOne({ _id: id });
  if (!post) {
    return resp.status(404).json({ message: "No se ha encontrado el post" });
  }
  await post.deleteOne();
  resp.json({ message: "El post ha sido eliminado correctamente" });
}

export { router };
