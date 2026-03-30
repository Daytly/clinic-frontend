import {createBrowserRouter} from "react-router";
import {Layout} from "./components/Layout.tsx";
import {Home} from "./pages/Home.tsx";
import {Login} from "./pages/Login.tsx";
import {Register} from "./pages/Register.tsx";
import {Specialists} from "./pages/Specialists.tsx";
import {SpecialistProfile} from "./pages/SpecialistProfile.tsx";
import {Profile} from "./pages/Profile.tsx";
import {StaffProfile} from "./pages/StaffProfile.tsx";
import {JoinTeam} from "./pages/JoinTeam.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "specialists", Component: Specialists },
      { path: "specialist/:id", Component: SpecialistProfile },
      { path: "profile", Component: Profile },
      { path: "staff-profile", Component: StaffProfile },
      { path: "join-team", Component: JoinTeam },
    ],
  },
]);