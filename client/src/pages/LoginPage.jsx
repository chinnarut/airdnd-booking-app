import axios from "axios";
import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { UserContext } from "../UserConttxt";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/login", {
        email,
        password
      });

      if(data) {
        setUser(data);
        alert("Login successfull...");
        setRedirect(true);
      } else {
        alert("User not found...")
      }
    } catch(err) {
      alert("Login fail, please try again...");
    }   
  };

  if(redirect) {
    return <Navigate to={"/"} />
  }

  return (
    <div className="mt-4 flex grow items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input 
            value={email}
            type="email" 
            placeholder="your@email.com" 
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            value={password}
            type="password" 
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button className="primary">Login</button>

          <div className="text-center py-2 text-gray-500">
            Don't have an account yet? <span></span>
            <Link to={"/register"} className="underline text-green-800">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
