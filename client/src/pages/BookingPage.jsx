import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDate from "../BookingDate";

const BookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if(id) {
      axios.get("/bookings").then(res => {
        const getBooking = res.data.find(({_id}) => _id === id);
        if(getBooking) {
          setBooking(getBooking);
        };
      });
    };
  }, [id]);

  if(!booking) {
    return "";
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking?.place?.title}</h1>
      <AddressLink className="my-2 block">
        {booking?.place?.address}
      </AddressLink>
      <div className="flex items-center justify-between bg-gray-200 p-6 my-6 rounded-2xl">
        <div>
          <h2 className="text-xl mb-2">Your booking information</h2>
          <BookingDate booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white font-bold rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${booking?.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking?.place} />
    </div>
  )
}

export default BookingPage
