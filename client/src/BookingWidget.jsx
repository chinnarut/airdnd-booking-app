import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserConttxt";

const BookingWidget = ({place}) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if(user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfDays = 0;
  if(checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  };

  const bookThisPlace = async () => {
    const bookingData = {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      mobile,
      place: place._id,
      price: numberOfDays * place?.price
    };

    const res = await axios.post("/bookings", bookingData);
    const bookingId = res.data?._id;
    
    setRedirect(`/profile/bookings/${bookingId}`);
  };

  if(redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
          <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
              Price: ${place?.price} / night
            </div>
            <div className="border rounded-2xl mt-4">
              <div className="flex">
                <div className="py-4 px-4">
                  <label>Check in: </label>
                  <input 
                    className="outline-none"
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)} 
                  />
                </div>
                <div className="py-4 px-4 border-l">
                  <label>Check out: </label>
                  <input
                    className="outline-none"
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)} 
                  />
                </div>
              </div>
              <div className="py-4 px-4 border-t">
                <label>Number of guests: </label>
                <input 
                  className="outline-none"
                  type="number" 
                  value={numberOfGuests} 
                  onChange={e => setNumberOfGuests(e.target.value)} 
                />
              </div>
              {numberOfDays > 0 && (
                <div className="py-4 px-4 border-t">
                  <label>Your full name: </label>
                  <input 
                    className="outline-none"
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                  />
                  <label>Your phone number: </label>
                  <input 
                    className="outline-none"
                    type="tel" 
                    value={mobile} 
                    onChange={e => setMobile(e.target.value)} 
                  />
                </div>
              )}
            </div>
            <button 
              className="primary mt-4"
              onClick={bookThisPlace}
            >
              Book this place
              {numberOfDays && (
                <span> ${(numberOfDays * place?.price)}</span>
              )}
            </button>
          </div>
        </div>
  )
}

export default BookingWidget
