import React, { useContext, useState } from "react";
import Calander from "./Calander";
import Button from "../Categories/Button/Button";
import { AuthContext } from "../../providers/AuthProvider";
import BookingModal from "../Modal/BookingModal";
import { formatDistance } from "date-fns";
import { addBooking, updateStatus } from "../../API/booking";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RoomReservation = ({ roomData }) => {
  const { user, role } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const navigate = useNavigate();

  const totalPrice =
    parseFloat(
      formatDistance(new Date(roomData.to), new Date(roomData.from)).split(
        " "
      )[0]
    ) * roomData.price;

  const [value, setValue] = useState({
    startDate: new Date(roomData?.from),
    endDate: new Date(roomData?.to),
    key: "selection",
  });

  // const [startDate, setStartDate] = useState(new Date(roomData?.from));
  // const [endDate, setEndDate] = useState(new Date(roomData?.to));

  // const onChanche = (dates) => {
  //   const [start, end] = dates;
  //   setStartDate(start);
  //   setEndDate(end);
  // };

  const [bookingInfo, setBookingInfo] = useState({
    guest: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    },
    host: roomData.host.email,
    location: roomData.location,
    price: totalPrice,
    to: value.endDate,
    from: value.startDate,
    title: roomData.title,
    rooomId: roomData._id,
    image: roomData.image,
  });

  console.log(bookingInfo);

  const handleSelect = (ranges) => {
    setValue({ ...value });
  };
  const modalHandler = () => {
    addBooking(bookingInfo)
      .then((data) => {
        console.log(data);
        toast.success("booking confirmed");
        updateStatus(roomData._id, true).then((data) => {
          console.log(data);
          toast.success("room booked");
          closeModal();
          navigate("/dashboard/my-bookings");
        });
      })
      .catch((err) => {
        console.log(err.message);
        toast.error(err.message);
        closeModal();
      });
  };
  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">${roomData.price}</div>
        <div className="font-light text-neutral-600">night</div>
      </div>
      <hr />
      <div className="flex justify-center">
        <Calander value={value} handleSelect={handleSelect}></Calander>
      </div>

      <hr />
      <div className="p-4">
        <Button
          onClick={() => setIsOpen(true)}
          disabled={roomData.host.email === user.email || roomData.booked}
          label="Reserve"
        ></Button>
      </div>
      <hr />
      <div className="p-4 flex flex-row items-center justify-between font-semibold  text-lg">
        <div>Total</div>
        <div>${totalPrice}</div>
      </div>
      <BookingModal
        isOpen={isOpen}
        bookingInfo={bookingInfo}
        modalHandler={modalHandler}
        closeModal={closeModal}
      ></BookingModal>
    </div>
  );
};

export default RoomReservation;
