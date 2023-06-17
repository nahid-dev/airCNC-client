import React, { useContext, useState } from "react";
import AddRoomForm from "../../components/Form/AddRoomForm";
import { imageUpload } from "../../API/utils";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { addRoom } from "../../API/rooms";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const [loading, setLoading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const location = event.target.location.value;
    const title = event.target.title.value;
    const from = dates.startDate;
    const to = dates.endDate;
    const price = event.target.price.value;
    const guests = event.target.total_guest.value;
    const bedrooms = event.target.bedrooms.value;
    const bathrooms = event.target.bathrooms.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    const image = event.target.image.files[0];
    setUploadButtonText("Uploading...");

    //   Upload image
    imageUpload(image)
      .then((data) => {
        console.log(data.data.display_url);
        const roomData = {
          image: data.data.display_url,
          location,
          title,
          host: {
            name: user?.displayName,
            image: user?.photoURL,
            email: user?.email,
          },
          from,
          to,
          guests,
          bedrooms,
          bathrooms,
          description,
          category,
          price,
        };
        // post room data:
        addRoom(roomData)
          .then((data) => {
            // console.log(data);
            setUploadButtonText("Uploaded!");
            setLoading(false);
            toast.success("Room Added");
            navigate("/dashboard/my-listings");
          })
          .catch((err) => console.log(err.message));
        // console.log(roomData);
        setLoading(false);
        toast.success("saved");
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });

    // console.log("Hello");
  };

  const handleImageChange = (image) => {
    setUploadButtonText(image.name);
  };
  const handleDates = (ranges) => {
    // console.log(range);
    setDates(ranges.selection);
  };
  return (
    <AddRoomForm
      handleSubmit={handleSubmit}
      loading={loading}
      handleImageChange={handleImageChange}
      uploadButtonText={uploadButtonText}
      dates={dates}
      handleDates={handleDates}
    ></AddRoomForm>
  );
};

export default AddRoom;
