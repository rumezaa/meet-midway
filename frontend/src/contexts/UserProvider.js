import { db, auth } from "../Firebase/Firebase";
import { doc, onSnapshot} from "firebase/firestore";
import { createContext, useState, useEffect } from "react";


export const UserContext = createContext([]);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        const docRef = doc(db, "users", userAuth.uid);
        const docUnsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data());
            setInitializing(false);
          } else {
            console.log("No such document!");
          }
        });

        return () => docUnsubscribe();
      } else {
        setUser(null);
        setInitializing(false);
      }
    });
    
    //unsubscribe format the  onAuthState changed cuz we don't need to listen if there isnt any change
    return () => unsubscribe();
  }, []);

  if (initializing) {
    return <h2>Loading</h2>;
  }

  
  return(
    <UserContext.Provider value={[user]}>
      {children}
    </UserContext.Provider>
  );
};