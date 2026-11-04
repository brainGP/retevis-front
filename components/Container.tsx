import React from "react";
interface ContainerProps {
  children: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="site-container flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
      {children}
    </div>
  );
};

export default Container;
