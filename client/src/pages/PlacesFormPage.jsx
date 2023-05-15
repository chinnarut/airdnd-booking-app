import { useEffect, useState } from "react";
import PhotosUploader from "./PhotosUploader";
import Perks from "../Perks";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

const PlacesFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState(""); 
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);

  useEffect(() => {
    if(!id) {
      return; 
    }

    axios.get(`/places/${id}`).then(res => {
      const { data } = res;

      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  const inputHeader = (text) => {
    return <h2 className="text-2xl mt-4">{text}</h2>
  };

  const inputDescription = (text) => {
    return <p className="text-gray-500 text-sm">{text}</p>
  };

  const preInput = (header, description) => {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  };

  const savePlace = async (e) => {
    e.preventDefault();
    const placeData = { 
      title, 
      address, 
      addedPhotos, 
      description, 
      perks, 
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    };

    if(id) {
      axios.put("/places", {
        id,
        ...placeData
      });

      setRedirect(true);
    } else {
      await axios.post("/places", placeData);
      setRedirect(true);
    };
  };

  if(redirect) {
    return <Navigate to={"/profile/places"} />
  }

  return (
    <>
      <div>
        <AccountNav />
        <form onSubmit={savePlace}>
          {preInput("Title", "Title for your place should be short and catchy as in advertisement")}
            <input 
              value={title}
              onChange={e => setTitle(e.target.value)}
              type="text" 
              placeholder="title for your apartment"
            />
            {preInput("Address", "Address to this place")}
            <input 
              value={address}
              onChange={e => setAddress(e.target.value)}
              type="text" 
              placeholder="address"
            />
            {preInput("Photos", "More photos is better")}
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            {preInput("Description", "Description of the place")}
            <textarea  
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            {preInput("Perks", "Select all the perks of your place")}
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 ld:grid-6 gap-1">
              <Perks selected={perks} onChange={setPerks} />
            </div>
            {preInput("Extra Info","House rules, etc.")}
            <textarea 
             value={extraInfo}
             onChange={e => setExtraInfo(e.target.value)}
            />
            {preInput("Check in & out times, max guests", " Add check in and out times, remember to have some time window for cleaning the room between guests")}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <h3 className="mt-2 -mb-1">Check in time</h3>
                <input 
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  type="text" 
                  placeholder="14:00" 
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Check out time</h3>
                <input 
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  type="text"
                  placeholder="11:00" 
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                <input 
                  value={maxGuests}
                  onChange={e => setMaxGuests(e.target.value)}
                  type="number"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Price per night</h3>
                <input 
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  type="number"
                />
              </div>
            </div>
            <div>
              <button className="primary my-4">Save</button>
            </div>
        </form>
      </div>  
    </>
  )
}

export default PlacesFormPage
