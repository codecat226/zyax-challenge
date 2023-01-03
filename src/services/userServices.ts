import axios from "axios";
import { LoginData } from "../types/userTypes";

const baseUrl = "https://test.zyax.se/";

export const loginUser = async (values: LoginData) => {
  const response = await axios.post(`${baseUrl}access/`, values);
  return response;
};
