"use client";

import { SessionProvider, type SessionProviderProps } from "next-auth/react";

export const Session = ({ ...props }: SessionProviderProps) => <SessionProvider {...props} />;
