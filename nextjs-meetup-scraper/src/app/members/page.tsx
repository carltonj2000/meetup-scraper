import Browser from "../browser";

async function Members() {
  return (
    <main className="max-w-xl mx-auto bg-gray-50 py-4 flex flex-col gap-3 items-center justify-center">
      <h2>Members</h2>
      <Browser
        action="db/json2db"
        description="Member JSON To DB"
        showJson={true}
      />
    </main>
  );
}

export default Members;
