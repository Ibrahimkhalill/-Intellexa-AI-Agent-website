import { Outlet } from "react-router";

const Main = () => {
  return (
    <div className="">
      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
