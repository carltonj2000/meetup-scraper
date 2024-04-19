import { membersByHikes } from "@/db";

async function Users() {
  const users = await membersByHikes();
  return (
    <section className="max-w-xl mx-auto bg-gray-50 py-4 flex flex-col gap-3 items-center justify-center">
      <p>Member Hikes</p>
      <table>
        <thead className="font-bold text-gray-100">
          <tr>
            <td className="p-4 bg-blue-400 text-center">Rank</td>
            <td className="p-4 bg-blue-400 text-center">Hikes</td>
            <td className="p-4 bg-blue-500 text-center">Name</td>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, name, hikes }, i) => (
            <tr key={id}>
              <td className="text-center">{i + 1}</td>
              <td className="text-center">{hikes}</td>
              <td className="text-left pl-2">{name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Users;
