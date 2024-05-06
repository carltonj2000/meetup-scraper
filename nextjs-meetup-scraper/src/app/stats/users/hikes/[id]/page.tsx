import { getHikesById, getUserById, getUserHikes } from "@/db";

export default async function UserHikes({ params: { id } }: any) {
  const user = await getUserById(id);
  const hikes = await getUserHikes(id);
  const hikeNamesUnsorted = await Promise.all(
    hikes.map(async (h) => {
      const details = await getHikesById(h.hikeId);
      return {
        id: h.hikeId,
        attended: h.attended,
        name: details.name,
        date: details.date,
      };
    })
  );
  const hikeNames = hikeNamesUnsorted.sort((a, b) =>
    Date.parse(a.date) > Date.parse(b.date) ? -1 : 1
  );
  const attended = hikeNames.reduce(
    (a, h) => (h.attended === "Went" ? a + 1 : a),
    0
  );
  const total = hikeNames.length;
  return (
    <div className="flex flex-col item-center pt-4">
      <h2>{user.name}</h2>
      <h3>Attended {attended} Hikes</h3>
      <h4>Signed Up For {total} Hikes</h4>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-400">
            <th className="py-2 pl-1">Attended</th>
            <th>Date</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {hikeNames.map(({ id, attended, name, date }, idx) => (
            <tr
              key={id}
              className={`${idx % 2 ? "bg-gray-200" : "bg-gray-300"} p-2`}
            >
              <td className="pl-1">{attended}</td>
              <td>{date}</td>
              <td>
                {name.length > 50 ? name.substring(0, 50) + " ..." : name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
