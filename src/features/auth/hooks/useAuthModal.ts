// import { useState } from "react";

// export default function useAuthModal() {
//   const [isOpen, setIsOpen] = useState(false);

//   const openModal = () => setIsOpen(true);
//   const closeModal = () => setIsOpen(false);

//   return { isOpen, openModal, closeModal };
// }

import { useState } from "react";

type Mode = "login" | "signup";

export default function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login"); // ✅ default LOGIN

  const openLogin = () => {
    setMode("login");
    setIsOpen(true);
  };

  const openSignup = () => {
    setMode("signup");
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    mode,
    openLogin,
    openSignup,
    closeModal,
  };
}