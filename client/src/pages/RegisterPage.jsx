import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();
    
    try {
      axios.post("/register", {
        name,
        email,
        password
      }); 
      
      setName("");
      setEmail("");
      setPassword("");
      alert("Register success, please login...");
    } catch(err) {
      alert("Register fail, pleae try again...")
    }
  };

  return (
    <div className="mt-4 flex grow items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input 
            value={name} type="text" 
            placeholder="John Doe" 
            onChange={e => setName(e.target.value)} 
          />
          <input 
            value={email}
            type="email" 
            placeholder="your@email.com"
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            value={password}
            type="password" 
            placeholder="password" 
            onChange={e => setPassword(e.target.value)} 
          />
          <button type="submit" className="primary">Register</button>

          <div className="text-center py-2 text-gray-500">
            Already have an account? <span></span>
            <Link to={"/login"} className="underline text-green-800">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
