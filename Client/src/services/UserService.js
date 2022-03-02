import axios from 'axios';


export async function register(creds) {
  try {
    const res = await axios.post('http://localhost:8000/signup', creds, {
      withCredentials: true
    });
    return res;
  } catch(err) {
    return err.response.data
  }
}
