import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../components/axiosinstance";

// Server data shared through the React Query cache. Pages that need the same
// data (e.g. bookings on Home and Booking List) reuse one request.
export const queryKeys = {
  bookings: ["bookings"],
  booking: (id) => ["bookings", String(id)],
  profile: ["profile"],
  plans: ["plans"],
  invoices: ["invoices"],
  subscription: ["subscription"],
  offers: ["offers"],
};

const getData = (url) => axiosInstance.get(url).then((res) => res.data);

/* ---------- Bookings ---------- */

export const useBookings = () =>
  useQuery({ queryKey: queryKeys.bookings, queryFn: () => getData("api/booking/list/") });

export const useBooking = (id) =>
  useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: () => getData(`api/booking/${id}/`),
    enabled: Boolean(id),
  });

export const useSaveBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) =>
      id
        ? axiosInstance.put(`api/booking/${id}/`, payload).then((res) => res.data)
        : axiosInstance.post("api/booking/create/", payload).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.bookings }),
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.delete(`api/booking/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.bookings }),
  });
};

/* ---------- Profile & billing ---------- */

export const useProfile = () =>
  useQuery({ queryKey: queryKeys.profile, queryFn: () => getData("api/auth/profile/") });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => axiosInstance.put("api/auth/profile/", formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.profile }),
  });
};

export const usePlans = () =>
  useQuery({
    queryKey: queryKeys.plans,
    queryFn: () => getData("api/payment/all-plan/"),
    staleTime: 10 * 60 * 1000, // plans rarely change
  });

export const useInvoices = () =>
  useQuery({
    queryKey: queryKeys.invoices,
    queryFn: () => getData("api/payment/me/").then((data) => data.invoices || []),
  });

export const useSubscription = () =>
  useQuery({
    queryKey: queryKeys.subscription,
    // null when the user has never subscribed
    queryFn: () => getData("api/payment/subscription/").then((data) => data.subscription ?? null),
  });

export const useToggleAutoRenew = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // cancel = true stops renewal at the end of the period, false resumes it
    mutationFn: (cancel) =>
      axiosInstance
        .post(`api/payment/subscription/${cancel ? "cancel" : "resume"}/`)
        .then((res) => res.data.subscription),
    onSuccess: (subscription) => queryClient.setQueryData(queryKeys.subscription, subscription),
  });
};

/* ---------- Offers (separate AI service) ---------- */

export const useOffers = () =>
  useQuery({
    queryKey: queryKeys.offers,
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_AI_BACKEND}/offers-api/offers`)
        .then((res) => res.data?.offers || []),
    staleTime: 5 * 60 * 1000,
  });
