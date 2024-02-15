import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function Settings() {
  return (
    <main className="container max-w-screen-md mt-72">
      <Card className="flex flex-col p-0 bg-bg-darker">
        <section className="flex flex-col gap-6 p-6 justify-center">
          <h2 className="text-3xl font-bold text-cyan">User Management</h2>
          <p className="text-text-primary">Reset Password</p>
          <Input
            type="password"
            className="w-full"
            placeholder="New Password"
          />
          <Button className="w-full">Reset Password</Button>
        </section>
      </Card>
    </main>
  );
}
