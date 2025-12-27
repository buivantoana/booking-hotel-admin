import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useBookingContext } from "../App";
import RegisterController from "../pages/register/RegisterController";
import LoginController from "../pages/login/LoginController";

import LayoutWebsite from "../components/layouts/LayoutWebsite";
import PrivateRouter from "../components/PrivateRouter";
import GuestRoute from "../components/GuestRoute";
import { useEffect } from "react";

import HomeController from "../pages/home/HomeController";
import ReviewController from "../pages/review/ReviewController";
import NotificateController from "../pages/notificate/NotificateController";

import ReconciliationController from "../pages/reconciliation/ReconciliationController";

import ApprovalController from "../pages/approval/ApprovalController";
import ManagerHotelController from "../pages/manager_hotel/ManagerHotelController";

import ManagerPaymentController from "../pages/manager-payment/ManagerPaymentController";
import BookingDetailController from "../pages/manager-booking/BookingDetailController";
import ManagerReviewController from "../pages/manager-review/ManagerReviewController";
import ManagerAccountController from "../pages/manager-account/ManagerAccountController";
import ProfileController from "../pages/profile/ProfileController";
import ManagerStaffController from "../pages/manager-staff/ManagerStaffController";

const Router = () => {
  const context: any = useBookingContext();
  const { pathname } = useLocation();
  useEffect(() => {
    // window.scrollTo(0, 0);
    // hoặc mượt hơn:
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return (
    <>
      <Routes>
        <Route path='/' element={<LayoutWebsite />}>
          <Route
            path='/'
            element={
              <PrivateRouter>
                <HomeController />
              </PrivateRouter>
            }
          />
          <Route
            path='/approval'
            element={
              <PrivateRouter>
                <ApprovalController />
              </PrivateRouter>
            }
          />
          <Route
            path='/manager-hotel'
            element={
              <PrivateRouter>
                <ManagerHotelController />
              </PrivateRouter>
            }
          />

          <Route
            path='/manager-payments'
            element={
              <PrivateRouter>
                <ManagerPaymentController />
              </PrivateRouter>
            }
          />

          <Route
            path='/manager-accounts'
            element={
              <PrivateRouter>
                <ManagerAccountController />
              </PrivateRouter>
            }
          />
          <Route
            path='/manager-staff'
            element={
              <PrivateRouter>
                <ManagerStaffController />
              </PrivateRouter>
            }
          />

          <Route
            path='/notificate'
            element={
              <PrivateRouter>
                <NotificateController />
              </PrivateRouter>
            }
          />
          <Route
            path='/review'
            element={
              <PrivateRouter>
                <ManagerReviewController />
              </PrivateRouter>
            }
          />

          <Route
            path='/reconciliation'
            element={
              <PrivateRouter>
                <ReconciliationController />
              </PrivateRouter>
            }
          />
          <Route
            path='/manager-bookings'
            element={
              <PrivateRouter>
                <BookingDetailController />
              </PrivateRouter>
            }
          />
          <Route
            path='/manager-profile'
            element={
              <PrivateRouter>
                <ProfileController />
              </PrivateRouter>
            }
          />
          <Route
            path='/approval'
            element={
              <PrivateRouter>
                <ApprovalController />
              </PrivateRouter>
            }
          />
        </Route>
        <Route
          path='/register'
          element={
            <GuestRoute>
              <RegisterController />
            </GuestRoute>
          }
        />

        <Route
          path='/login'
          element={
            <GuestRoute>
              <LoginController />
            </GuestRoute>
          }
        />
      </Routes>
    </>
  );
};

export default Router;
