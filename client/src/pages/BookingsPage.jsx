import { useEffect, useState } from "react"
import AccountNav from "../AccountNav"
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import BookingDate from "../BookingDate";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("/bookings").then(res => {
      setBookings(res.data);
    })
  }, []);

  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 && bookings.map(booking => (
          <Link
            to={`/profile/bookings/${booking?._id}`} 
            className="flex gap-4 bg-gray-100 rounded-2xl overflow-hidden" 
            key={booking?._id}
          >
            <div className="w-48">
              <PlaceImg className="h-full" place={booking?.place} />
            </div>
            <div className="py-3 pr-3 grow">
              <h2>{booking?.place?.title}</h2>
              <BookingDate booking={booking} />
              <div className="text-xl">
                <div className="flex gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                  {differenceInCalendarDays(new Date(booking?.checkOut), new Date(booking?.checkIn))} nights
                </div>
                <div className="flex gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  Total price: ${booking?.price}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BookingsPage
