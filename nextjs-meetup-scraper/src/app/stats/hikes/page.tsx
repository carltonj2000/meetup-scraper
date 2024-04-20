import { hikes } from "@/db";
import Hikes from "./hikes";

async function HikesPage() {
  const hks = await hikes();
  return (
    <section className="max-w-3xl mx-auto bg-gray-50 py-4 flex flex-col gap-3 items-center justify-center">
      <p>Hikes</p>
      <Hikes hks={hks} />
    </section>
  );
}

export default HikesPage;
