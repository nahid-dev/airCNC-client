import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/home/Home";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import RoomDetails from "../pages/RoomDetails/RoomDetails";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AddRoom from "../pages/Dashboard/AddRoom";
import { getRoom } from "../API/rooms";
import MyBookings from "../pages/Dashboard/MyBookings";
import MyListings from "../pages/Dashboard/MyListing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "room/:id",
        element: (
          <PrivateRoute>
            <RoomDetails></RoomDetails>
          </PrivateRoute>
        ),
        loader: ({ params }) => getRoom(params.id),
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/signUp",
    element: <SignUp></SignUp>,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <MyBookings></MyBookings>,
      },
      {
        path: "/dashboard/add-room",
        element: <AddRoom></AddRoom>,
      },
      {
        path: "/dashboard/my-bookings",
        element: <MyBookings></MyBookings>,
      },
      {
        path: "/dashboard/my-listings",
        element: <MyListings></MyListings>,
      },
    ],
  },
]);
