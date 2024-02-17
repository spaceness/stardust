import { Card } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
export default function NotFound() {
  return (
    <main className="flex justify-center items-center mx-auto min-h-screen">
      <Card className="flex flex-col p-0 bg-bg-darker w-96 h-96 justify-center">
        <section className="flex items-center gap-6 p-6 justify-center sm:p-9 text-center flex-col">
          <h1 className="text-6xl text-white">404</h1>
          <h2 className="text-3xl font-bold text-white">Page not found</h2>
        </section>
        <section className="flex flex-col p-6 w-48 text-center items-center mx-auto">
          <Link href="/">Go back home</Link>
        </section>
      </Card>
    </main>
  );
}
