
import axios from "axios"
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function fetchUser() {
  try {
    const res = await axios.get(`${apiUrl}/users/profile`, {
      withCredentials: true,
    });
    return res.data.user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data.error) {
      console.error(error.response.data.error);
    }
    return null;
  }
}
