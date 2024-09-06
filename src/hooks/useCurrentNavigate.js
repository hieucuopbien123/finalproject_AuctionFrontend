import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useCurrentNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback((newPath) => {
    const currentPath = location.pathname;
    if (currentPath !== newPath) {
      navigate(newPath);
    }
  }, [location.pathname, navigate]);
}

export default useCurrentNavigate;