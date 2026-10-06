import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import axiosInstance from "../../../components/axiosinstance";
import * as notifyModule from "../../../utils/notify";
import { renderWithProviders } from "../../../test/renderWithProviders";
import BookingList from "./BookingList";

const booking = {
  id: 5,
  booking_type: "spa",
  location: "Test Spa",
  booking_datetime: "2030-01-10T10:00:00Z",
  created_at: "2029-12-01T10:00:00Z",
};

describe("BookingList", () => {
  afterEach(() => vi.restoreAllMocks());

  it("shows the Add Booking button even when there are no bookings", async () => {
    vi.spyOn(axiosInstance, "get").mockResolvedValue({ data: [] });
    renderWithProviders(<BookingList />);

    expect(await screen.findByText(/no bookings yet/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add booking/i })).toBeInTheDocument();
  });

  it("opens the edit page for a booking", async () => {
    vi.spyOn(axiosInstance, "get").mockResolvedValue({ data: [booking] });
    renderWithProviders(<BookingList />);

    await userEvent.click(await screen.findByRole("button", { name: "Edit booking" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/booking/5");
  });

  it("deletes a booking after confirmation and refreshes the list", async () => {
    const get = vi
      .spyOn(axiosInstance, "get")
      .mockResolvedValueOnce({ data: [booking] })
      .mockResolvedValue({ data: [] });
    const del = vi.spyOn(axiosInstance, "delete").mockResolvedValue({ status: 204 });
    vi.spyOn(notifyModule, "confirmAction").mockResolvedValue(true);
    vi.spyOn(notifyModule.notify, "success").mockImplementation(() => {});
    renderWithProviders(<BookingList />);

    await userEvent.click(await screen.findByRole("button", { name: "Delete booking" }));

    await waitFor(() => expect(del).toHaveBeenCalledWith("api/booking/5/"));
    expect(await screen.findByText(/no bookings yet/i)).toBeInTheDocument();
    expect(get).toHaveBeenCalledTimes(2);
  });

  it("does nothing when deletion is cancelled", async () => {
    vi.spyOn(axiosInstance, "get").mockResolvedValue({ data: [booking] });
    const del = vi.spyOn(axiosInstance, "delete");
    vi.spyOn(notifyModule, "confirmAction").mockResolvedValue(false);
    renderWithProviders(<BookingList />);

    await userEvent.click(await screen.findByRole("button", { name: "Delete booking" }));
    expect(del).not.toHaveBeenCalled();
  });
});
