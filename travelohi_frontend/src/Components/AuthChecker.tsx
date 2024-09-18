import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuthChecker = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.ok) {
          setAuthenticated(true);
        } else {
          // navigate('/login');
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // navigate('/login');
      }
    };

    checkAuthentication();
  }, [navigate]);

  return authenticated;
};

export default useAuthChecker;
