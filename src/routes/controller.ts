import { Response, Request, Router } from "express";
import { UserRegister, Userlogin } from "../helpers/data.interface";
import { UserModel } from "../mongo/models/users.model";

const router: Router = Router();

/**
 * * USERS
 */

router.get(
  "/users/login",
  async (req: Request<void, void, Userlogin>, resp: Response) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne<UserRegister>({ email });
      if (!user) {
        return resp.status(400).json({ message: "Credenciales inválidas" });
      }
      if(user.password !== password) {
        return resp.status(400).json({ message: "Credenciales inválidas" });
      } 
      resp.status(200).json(user);
    } catch (error) {
      console.error(error);
      resp
        .status(500)
        .json({ message: "Ha ocurrido un error al procesar la solicitud" });
    }
  }
);

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

async function register(user: UserRegister, resp: Response) {
  const { email, name, password } = user;
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
  const newUser = new UserModel(user);
  await newUser.save();
  return resp.status(201).json(newUser);
}

/**
 * * POSTS
 */

router.get("/post", async (req: Request, resp: Response) => {});

router.post("/post", async (req: Request, resp: Response) => {});

router.put("/post", async (req: Request, resp: Response) => {});

router.delete("/post", async (req: Request, resp: Response) => {});

export { router };
