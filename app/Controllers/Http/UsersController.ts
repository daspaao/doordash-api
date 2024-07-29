import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User, { AccountType } from "App/Models/User";

type UserDto = {
  username: string;
  email: string;
  password: string;
  accountType: AccountType;
};

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userDto = request.all() as UserDto;

    const user = await User.create(userDto);

    return response
      .status(201)
      .json({ message: "check user endpoint", userId: user.id });
  }

  public async login({ response, request, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    const user = await User.query().where("email", email).first();

    if (!user) {
      return response
        .status(404)
        .status(200)
        .json({ message: "user does not exist!" });
    }

    const token = await auth.use("api").attempt(email, password);
    return response.status(201).json({ message: "loggedIn", token });
  }
}

// Stateless
