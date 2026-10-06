import Swal from "sweetalert2";

// One toast style for the whole app (top-right, auto-closing)
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export const notify = {
  success: (title, text) => Toast.fire({ icon: "success", title, text }),
  error: (title, text) => Toast.fire({ icon: "error", title, text }),
  info: (title, text) => Toast.fire({ icon: "info", title, text }),
};

// Confirmation dialog for destructive actions; resolves to true/false
export const confirmAction = async ({ title, text, confirmButtonText = "Yes" }) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancel",
    confirmButtonColor: "#111827",
  });
  return result.isConfirmed;
};
