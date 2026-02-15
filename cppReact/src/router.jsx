import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./component/DefaultLayout";
import Home from "./Home";
import Signup from "./Accounts/Signup";
import Branches from "./pages/Branches";
import Login from "./Accounts/Login";
import AHome from "./AdminPages/AHome";
import GuestLayout from "./component/GuestLayout";
import Guest from "./Guest/Guest";
import ADefaultLayout from "./component/ADefaultLayout";
import HoldedAccounts from "./AdminPages/HoldedAccounts";
import ABranches from "./AdminPages/ABranches";
import SendMoney from "./pages/SendMoney";
import UserTransaction from "./pages/UserTransaction";
import AAllTransaction from "./AdminPages/AAllTransaction";
import Loan from "./pages/Loan";
import ChangePassword from "./pages/ChangePassword";
import PasswordChangeRequests from "./AdminPages/PasswordChangeRequests";
import HandleLoans from "./AdminPages/HandleLoan";
import Fixed from "./pages/Fixed";
import HandleFixed from "./AdminPages/HandleFixed";
import AllUsers from "./AdminPages/AllUsers";
import Profile from "./pages/Profile";
const router = createBrowserRouter([

    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/",
                element: <Guest />
            },
            {
                path: "/branches",
                element: <Branches />
            }
        ]
    },
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "home",
                element: <Home />
            }, {
                path: "/user/branches",
                element: <Branches />
            },
            {
                path: "send-money",
                element: <SendMoney />
            },
            {
                path: "user-transaction",
                element: <UserTransaction />
            },
            {
                path: "loan-request",
                element: <Loan />
            },
            {
                path: "change-password",
                element: <ChangePassword />
            },
            {
                path: "fixed-request",
                element: <Fixed />
            },
            {
                path: "profile",
                element: <Profile />
            }
        ]
    },
    {
        path: "/admin",
        element: <ADefaultLayout />,
        children: [
            {
                path: "admin-home",
                element: <AHome />
            },
            {
                path: "holded-accounts",
                element: <HoldedAccounts />
            },
            {
                path: "branches",
                element: <ABranches />
            },
            {
                path: "all-transactions",
                element: <AAllTransaction />
            },
            {
                path: "password-change-requests",
                element: <PasswordChangeRequests />
            },
            {
                path: "handle-loan-request",
                element: <HandleLoans />
            }, {
                path: "handle-fixed-request",
                element: <HandleFixed />
            },
            {
                path: "all-users-data",
                element: <AllUsers />
            }

        ]
    },
    {
        path: "/signup",
        element: <Signup />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/branches",
        element: <Branches />
    },
    {
        path: "*",
        element: <div className="flex items-center justify-center h-[90vh]"><h1 className="text-6xl  font-bold text-red-600">Not Found 404</h1></div>
    }


]);

export default router;