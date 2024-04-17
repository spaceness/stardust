"use client";

import { SessionProvider, SessionProviderProps } from "next-auth/react";

export const Session = ({ ...props }: SessionProviderProps) => <SessionProvider {...props} />;
