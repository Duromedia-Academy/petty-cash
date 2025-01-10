"use client";

import { createContext, useContext, useState } from "react";

const mobileSidebarToggleContext = createContext<
  | {
      isOpen: boolean;
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

interface mobileProviderProps {
  children: React.ReactNode;
}

export const MobileSidebarProvider: React.FC<mobileProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <mobileSidebarToggleContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </mobileSidebarToggleContext.Provider>
  );
};

export const useMobileSidebarToggle = () => {
  const context = useContext(mobileSidebarToggleContext);
  if (context === undefined) {
    throw new Error(
      "useMobileSidebarToggle must be used within a MobileSidebarProvider"
    );
  }
  return context;
};
