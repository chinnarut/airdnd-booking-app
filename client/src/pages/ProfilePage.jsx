import { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { UserContext } from "../UserConttxt";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

const ProfilePage = () => {
  const [redirect, setRedirect] = useState(null);
  const { user, setUser, ready, setReady } = useContext(UserContext);

  let { subpage } = useParams();
  if(subpage === undefined) {
    subpage = "profile";
  };

  const logout = async () => {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  };

  if(ready && !user && !redirect) {
    return <Navigate to={"/login"} />
  };

  if(redirect) {
    return <Navigate to={redirect} />
  }
  
  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Login as {user?.name} ({user?.email}) <br />
          <button 
            className="primary max-w-sm mt-2"
            onClick={logout}
          > 
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && (
        <PlacesPage />
      )}
    </div>
  )
}

export default ProfilePage
