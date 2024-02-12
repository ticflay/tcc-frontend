"use client";
import { useState, createContext, useContext } from "react";
import {User} from '@/models/user';

import { create } from 'zustand';
import { io  } from 'socket.io-client';
import { SERVER_URL } from "@/services/config/server";
// export const socket = io(SERVER_URL, {});

export interface UserState {
    currentUser?: User;
    token?: string;
    loading: boolean;
}

export interface UserActions {
    setCurrentUser: (user?: User) => void;
    resetCurrentUser: () => void;
    setToken: (token: string) => void;
}
let token: string | undefined = undefined;
let currentUser: undefined | User = undefined;
if(typeof window !== 'undefined') {
    const currentUserString = localStorage.getItem("current-user");
    token = localStorage.getItem("token") ?? undefined;
     currentUser = currentUserString ? JSON.parse(currentUserString) : undefined;
  }

export type UserStore = UserState & UserActions;


const initialUserState: UserState = {
    currentUser,
    token,
    loading: true
}
  


export const createStore = ({currentUser, token, loading}: UserState) => create<UserStore>(
    (set, get) => {
        return {
        ...initialUserState,
        currentUser,
        loading,
        token,
        resetCurrentUser: () => {
            localStorage.clear();
            // socket.emit('userLeft', get().currentUser?.id);
            set({currentUser: undefined, loading: false, token: undefined})

        },
        setCurrentUser: (user) => {
            localStorage.setItem('current-user', JSON.stringify(user))
            set((state) => ({...state, ...{currentUser: user}}))
        },
        setToken: (token) => {
            localStorage.setItem('token', JSON.stringify(token))
            set((state) => ({...state, ...{token: token}}))
        },
    }},
);

const UserContext = createContext<ReturnType<typeof createStore> | null>(null);

export const useUser = () => {
    return useContext(UserContext);
}

interface UserProviderProps {
    children: React.ReactNode;
}

const UserProvider = ({children}: UserProviderProps) => {
    const currentUserString = localStorage.getItem("current-user");
    const token = localStorage.getItem("token") ?? undefined;
    const currentUser = currentUserString ? JSON.parse(currentUserString) : undefined;
    const [store] = useState(() =>  createStore({currentUser, token, loading: false}));


    return <UserContext.Provider value={store}>{children}</UserContext.Provider>
}
export default UserProvider;