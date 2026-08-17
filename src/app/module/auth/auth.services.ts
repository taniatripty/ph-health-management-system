
import { auth } from "../../lib/auth";

type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
};
type LoginUserPayload = {
  email: string;
  password: string;
};

const registerUser = async (payload: RegisterUserPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
     // role: Role.PATIENT,
    },
  });

  return data.user;
};

const loginUser = async (payload: LoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  return data;
};

export const authServices = {
  registerUser,
  loginUser
};