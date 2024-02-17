import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function Settings() {
  return (
    <main className="flex justify-center items-center mx-auto min-h-screen">
      <Card className="flex flex-col p-0 bg-bg-darker w-[700px] h-[700px] mx-auto justify-center">
        <section className="flex flex-col gap-4 p-6 justify-center">
          <h2 className="text-3xl font-bold text-white">Settings</h2>
          <label className="text-text-primary">Reset Password</label>
          <Input
            type="password"
            className="w-full"
            placeholder="New Password"
          />
          <Button className="w-full" variants={{ variant: "primary" }}>
            Reset Password
          </Button>
        </section>
      </Card>
    </main>
  );
}
