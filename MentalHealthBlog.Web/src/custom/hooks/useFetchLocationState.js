import { useLocation } from "react-router-dom";

const useFetchLocationState = () => {
  const location = useLocation();
  return location.state;
};

export default useFetchLocationState;
