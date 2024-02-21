"use client";
import { signIn } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function Login() {
  return (
    <main className="flex justify-center items-center mx-auto min-h-screen">
      <Card className="flex flex-col p-0 w-[576px] h-96 mx-auto justify-center items-center">
        <h2 className="text-3xl font-bold text-text-primary">
          Welcome to Stardust
        </h2>
        <section className="flex flex-col gap-4 p-6 justify-center items-center">
          <Input className="w-96 text-text-primary" placeholder="Email" />
          <Button
            className="w-48"
            variants={{ variant: "primary" }}
            onClick={(values: any) => {
              signIn("email", {
                ...values,
              });
            }}
          >
            Send Magic Link
          </Button>
        </section>
      </Card>
    </main>
  );
}
