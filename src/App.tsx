import Router from "./routes/Routes";
import "./App.css";
import { createContext, useContext, useEffect, useReducer } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { getInfo } from "./service/voice";
import { I18nextProvider } from "react-i18next";
import i18n from "./translation/i18n";
import { BrowserRouter, useLocation } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
const queryClient = new QueryClient();
export const coursesContext = createContext({});

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload.user,
      };
      case "UPDATE_CREATE_HOTEL":
        return {
          ...state,
          create_hotel: {...state.create_hotel,...action.payload.create_hotel},
        };
    case "LOGOUT":
      return {
        ...state,
        user: {},
      };
    default:
      return state;
  }
};
const App = () => {
  
  const [state, dispatch] = useReducer(reducer, {
    user: {},
    history: {},
    tts_text: "",
    tts_story: "",
    create_hotel: {},
  });
  let user = localStorage.getItem("user");
  useEffect(() => {
    if (user) {
      (async () => {
        dispatch({
          type: "LOGIN",
          payload: {
            ...state,
            user: { ...JSON.parse(user) },
          },
        });
      })();
    }
  }, [user]);
 
  // console.log("AAAA state ====", state);
  return (
    <div>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <coursesContext.Provider value={{ dispatch, state }}>
              <BrowserRouter>
                <Router />
              </BrowserRouter>
            </coursesContext.Provider>
          </QueryClientProvider>
        </ThemeProvider>
        <ToastContainer />
      </I18nextProvider>
    </div>
  );
};
export const useBookingContext = () => useContext(coursesContext);
export default App;
