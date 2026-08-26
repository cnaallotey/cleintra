"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, BusinessAccount, SignUpInput, SignInInput, UpdateBusinessProfileInput, AuthContextState } from "@/types/auth";
import { auth, db } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AUTH_USER_KEY = "simple_crm_auth_user_v1";
const AUTH_ACCOUNTS_KEY = "simple_crm_accounts_db_v1";

const AuthContext = createContext<AuthContextState | null>(null);

const DEFAULT_INITIAL_ACCOUNTS: Array<BusinessAccount & { passwordHash: string }> = [
  {
    id: "biz_demo_1",
    name: "Adom Enterprise",
    email: "owner@adom.com",
    ownerId: "usr_demo_1",
    passwordHash: "password123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [business, setBusiness] = useState<BusinessAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Synchronize auth state with Firebase Auth and fallback to local storage
  useEffect(() => {
    let unsubscribe = () => {};

    if (auth) {
      try {
        unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
          if (fbUser) {
            const bizName = fbUser.displayName || "My Business";
            const authUser: AuthUser = {
              uid: fbUser.uid,
              email: fbUser.email || "",
              businessName: bizName
            };
            setUser(authUser);
            setBusiness({
              id: fbUser.uid,
              name: bizName,
              email: fbUser.email || "",
              ownerId: fbUser.uid,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
          } else {
            // Check local fallback
            const stored = localStorage.getItem(AUTH_USER_KEY);
            if (stored) {
              const parsed: AuthUser = JSON.parse(stored);
              setUser(parsed);
              setBusiness({
                id: parsed.uid,
                name: parsed.businessName,
                email: parsed.email,
                ownerId: parsed.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
            } else {
              setUser(null);
              setBusiness(null);
            }
          }
          setLoading(false);
        });
      } catch (e) {
        console.warn("Firebase Auth listener error, using local session:", e);
        fallbackLocalSession();
      }
    } else {
      fallbackLocalSession();
    }

    function fallbackLocalSession() {
      try {
        const stored = localStorage.getItem(AUTH_USER_KEY);
        if (stored) {
          const parsed: AuthUser = JSON.parse(stored);
          setUser(parsed);
          setBusiness({
            id: parsed.uid,
            name: parsed.businessName,
            email: parsed.email,
            ownerId: parsed.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } catch (e) {
        console.error("Failed to load local session:", e);
      } finally {
        setLoading(false);
      }
    }

    return () => unsubscribe();
  }, []);

  const getAccountsDb = (): Array<BusinessAccount & { passwordHash: string }> => {
    try {
      const raw = localStorage.getItem(AUTH_ACCOUNTS_KEY);
      if (!raw) {
        localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(DEFAULT_INITIAL_ACCOUNTS));
        return DEFAULT_INITIAL_ACCOUNTS;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_INITIAL_ACCOUNTS;
    }
  };

  const saveAccountsDb = (accounts: Array<BusinessAccount & { passwordHash: string }>) => {
    try {
      localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error("Failed to save accounts database:", e);
    }
  };

  const formatFirebaseError = (err: any): string => {
    const code = err?.code || "";
    if (code === "auth/email-already-in-use") {
      return "An account with this email already exists. Please sign in instead.";
    }
    if (
      code === "auth/invalid-credential" || 
      code === "auth/wrong-password" || 
      code === "auth/user-not-found" ||
      code === "auth/invalid-email"
    ) {
      return "Incorrect email or password. Please check your credentials.";
    }
    if (code === "auth/weak-password") {
      return "Password must be at least 6 characters long.";
    }
    if (code === "auth/too-many-requests") {
      return "Too many unsuccessful attempts. Please try again in a few minutes.";
    }
    if (code === "auth/network-request-failed") {
      return "Unable to connect. Please check your internet connection.";
    }
    return err?.message || "An unexpected error occurred. Please try again.";
  };

  const signUp = async (input: SignUpInput): Promise<AuthUser> => {
    setError(null);
    const businessName = input.businessName.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    if (!businessName || businessName.length < 2) {
      const msg = "Business name must be at least 2 characters.";
      setError(msg);
      throw new Error(msg);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      throw new Error(msg);
    }

    if (!password || password.length < 6) {
      const msg = "Password must be at least 6 characters long.";
      setError(msg);
      throw new Error(msg);
    }

    // Attempt Firebase Auth sign-up first
    if (auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: businessName });

        if (db) {
          try {
            await setDoc(doc(db, "businesses", cred.user.uid), {
              id: cred.user.uid,
              name: businessName,
              email,
              ownerId: cred.user.uid,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          } catch (firestoreErr) {
            console.warn("Firestore business doc sync deferred:", firestoreErr);
          }
        }

        const authUser: AuthUser = {
          uid: cred.user.uid,
          email,
          businessName
        };

        setUser(authUser);
        setBusiness({
          id: cred.user.uid,
          name: businessName,
          email,
          ownerId: cred.user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        return authUser;
      } catch (fbErr: any) {
        console.warn("Firebase SignUp exception, falling back to local store:", fbErr);
        // If it's a known validation error from Firebase (e.g. email in use), throw formatted error
        if (fbErr?.code) {
          const formatted = formatFirebaseError(fbErr);
          setError(formatted);
          throw new Error(formatted);
        }
      }
    }

    // Local account fallback
    const accounts = getAccountsDb();
    if (accounts.some((acc) => acc.email === email)) {
      const msg = "An account with this email already exists. Please sign in instead.";
      setError(msg);
      throw new Error(msg);
    }

    const newBizId = `biz_${Date.now()}`;
    const newAccount = {
      id: newBizId,
      name: businessName,
      email,
      ownerId: newBizId,
      passwordHash: password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveAccountsDb([...accounts, newAccount]);

    const authUser: AuthUser = {
      uid: newBizId,
      email,
      businessName
    };

    setUser(authUser);
    setBusiness(newAccount);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
    return authUser;
  };

  const signIn = async (input: SignInInput): Promise<AuthUser> => {
    setError(null);
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    if (!email || !password) {
      const msg = "Please enter both email and password.";
      setError(msg);
      throw new Error(msg);
    }

    // Attempt Firebase Auth sign-in first
    if (auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const bizName = cred.user.displayName || "My Business";

        const authUser: AuthUser = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          businessName: bizName
        };

        setUser(authUser);
        setBusiness({
          id: cred.user.uid,
          name: bizName,
          email: cred.user.email || email,
          ownerId: cred.user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        return authUser;
      } catch (fbErr: any) {
        console.warn("Firebase SignIn exception, checking local accounts fallback:", fbErr);
        if (fbErr?.code && fbErr.code !== "auth/network-request-failed" && fbErr.code !== "auth/invalid-api-key") {
          // If demo credentials match locally, let demo account work
          const accounts = getAccountsDb();
          const localFound = accounts.find((acc) => acc.email === email && acc.passwordHash === password);
          if (!localFound) {
            const formatted = formatFirebaseError(fbErr);
            setError(formatted);
            throw new Error(formatted);
          }
        }
      }
    }

    // Local fallback sign-in
    const accounts = getAccountsDb();
    const found = accounts.find((acc) => acc.email === email && acc.passwordHash === password);

    if (!found) {
      const msg = "Incorrect email or password. Please check your credentials.";
      setError(msg);
      throw new Error(msg);
    }

    const authUser: AuthUser = {
      uid: found.id,
      email: found.email,
      businessName: found.name
    };

    setUser(authUser);
    setBusiness(found);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
    return authUser;
  };

  const signInWithGoogle = async (): Promise<AuthUser> => {
    setError(null);
    if (!auth) {
      const msg = "Google Sign In is not available in offline mode.";
      setError(msg);
      throw new Error(msg);
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const cred = await signInWithPopup(auth, provider);
      const bizName = cred.user.displayName || (cred.user.email ? cred.user.email.split("@")[0] : "My Business");

      if (db) {
        try {
          const bizDocRef = doc(db, "businesses", cred.user.uid);
          const snap = await getDoc(bizDocRef);
          if (!snap.exists()) {
            await setDoc(bizDocRef, {
              id: cred.user.uid,
              name: bizName,
              email: cred.user.email || "",
              ownerId: cred.user.uid,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        } catch (firestoreErr) {
          console.warn("Firestore business sync:", firestoreErr);
        }
      }

      const authUser: AuthUser = {
        uid: cred.user.uid,
        email: cred.user.email || "",
        businessName: bizName
      };

      setUser(authUser);
      setBusiness({
        id: cred.user.uid,
        name: bizName,
        email: cred.user.email || "",
        ownerId: cred.user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      return authUser;
    } catch (err: any) {
      if (err?.code === "auth/popup-closed-by-user") {
        throw new Error("Sign in was cancelled.");
      }
      const formatted = formatFirebaseError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const updateBusinessProfile = async (input: UpdateBusinessProfileInput): Promise<BusinessAccount> => {
    setError(null);
    const newName = input.name.trim();

    if (!newName || newName.length < 2) {
      const msg = "Business name must be at least 2 characters.";
      setError(msg);
      throw new Error(msg);
    }

    if (input.supportEmail && input.supportEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.supportEmail.trim())) {
        const msg = "Please enter a valid support email address.";
        setError(msg);
        throw new Error(msg);
      }
    }

    const currentBizId = business?.id || user?.uid || "biz_demo_1";
    const currentEmail = business?.email || user?.email || "";
    const now = new Date().toISOString();

    const updatedBiz: BusinessAccount = {
      id: currentBizId,
      name: newName,
      email: currentEmail,
      ownerId: currentBizId,
      ownerName: input.ownerName ? input.ownerName.trim() || null : null,
      supportEmail: input.supportEmail ? input.supportEmail.trim() || null : null,
      phone: input.phone ? input.phone.trim() || null : null,
      currency: input.currency || "GHS",
      industry: input.industry || "Services",
      createdAt: business?.createdAt || now,
      updatedAt: now
    };

    // 1. Update Firebase Auth user display name if available
    if (auth && auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: newName });
      } catch (err) {
        console.warn("Firebase Auth displayName update:", err);
      }
    }

    // 2. Update Firestore business document if available
    if (db) {
      try {
        const bizDocRef = doc(db, "businesses", currentBizId);
        await setDoc(bizDocRef, updatedBiz, { merge: true });
      } catch (firestoreErr) {
        console.warn("Firestore business profile update:", firestoreErr);
      }
    }

    // 3. Update local accounts DB
    const accounts = getAccountsDb();
    const existingIdx = accounts.findIndex((acc) => acc.id === currentBizId || acc.email === currentEmail);
    if (existingIdx !== -1) {
      accounts[existingIdx] = {
        ...accounts[existingIdx],
        ...updatedBiz
      };
      saveAccountsDb(accounts);
    }

    // 4. Update session storage
    const updatedUser: AuthUser = {
      uid: currentBizId,
      email: currentEmail,
      businessName: newName
    };

    setUser(updatedUser);
    setBusiness(updatedBiz);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));

    return updatedBiz;
  };

  const signOut = async (): Promise<void> => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn("Firebase signOut error:", e);
      }
    }
    setUser(null);
    setBusiness(null);
    setError(null);
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch (e) {
      console.error("Failed to remove auth key:", e);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        updateBusinessProfile,
        signOut,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
