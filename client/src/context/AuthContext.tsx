import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type UserContext = {
  id: number;
  firstname: string;
  lastname: string;
  profile_pic: string;
  car_brand: string;
  car_template: string;
  car_socket: string;
  email: string;
  role_id: number;
};

type AuthContext = {
  user: UserContext | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserContext | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur:",
          error
        );
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        return false;
      }

      const responseData = await response.json();

      if (responseData.user) {
        setUser(responseData.user);
        setIsAuthenticated(true);
        return true;
      }

      console.error("Login: Données utilisateur manquantes dans la réponse");
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Erreur lors du logout:", err);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être dans le AuthProvider");
  }
  return context;
};
