import { Button } from "@/components/ui/button";
import { getPath } from "../util";

async function Database() {
  return (
    <main className="max-w-xl mx-auto bg-gray-50 py-4 flex flex-col gap-3 items-center justify-center">
      <h2>Database</h2>
      <Button onClick={async () => await getPath("db/json2db")}>
        Member JSON To DB
      </Button>
      <Button onClick={async () => await getPath("db/restore")}>
        Restore Old To New Empty DB
      </Button>
    </main>
  );
}

export default Database;
