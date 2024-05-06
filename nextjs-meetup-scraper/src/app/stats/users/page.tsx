import { membersByHikesAttended } from "@/db";
import Link from "next/link";

async function Users() {
  const basePath = "/stats/users/hikes/";
  const users = await membersByHikesAttended();
  return (
    <section className="max-w-xl mx-auto bg-gray-50 py-4 flex flex-col gap-3 items-center justify-center">
      <p>Members</p>
      <table>
        <thead className="font-bold text-gray-100">
          <tr>
            <td className="p-4 bg-blue-500 text-center">Rank</td>
            <td className="p-4 bg-blue-500 text-center">Hikes</td>
            <td className="p-4 bg-blue-500 text-center">Name</td>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, attended, name }, i) => (
            <tr key={id} className={i % 2 === 0 ? "bg-blue-50" : "bg-blue-100"}>
              <td className="text-center">{i + 1}</td>
              <td className="text-center">{attended}</td>
              <td className="text-left pl-2 text-blue-700">
                <Link href={`${basePath}${id}`}>{name}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Users;
