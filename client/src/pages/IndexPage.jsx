import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import Image from "../Image";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/places").then(res => {
      setPlaces(res.data);
    })
  }, []);

  return (
    <div className="mt-8 gap-x-6 gap-y-8 grid gris-cols-4 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 && places?.map((place) => (
        <Link to={`/place/${place?._id}`} key={place?._id}>
          <div className="mb-2 flex bg-gray-500 rounded-2xl">
            {place?.photos[0] && (
              <Image 
                className="rounded-2xl aspect-square object-cover"
                src={place?.photos[0]} 
                alt="photo"
              />
            )}
          </div>
          <h3 className="font-bold">{place.address}</h3>
          <h2 className="text-sm text-gray-500">{place.title}</h2>
          <div className="mt-1">
            <span className="font-bold">${place.price}</span> per night
          </div>
        </Link>
      ))}
    </div>
  )
}

export default IndexPage
