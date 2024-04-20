import { getBaseHikesByLevel, getHikesById } from "@/db";

async function Hikes({ params }: { params: { hikeId: string } }) {
  const hike = await getHikesById(Number(params.hikeId));
  const bhl1 = await getBaseHikesByLevel(1);
  return (
    <section className="max-w-3xl mx-auto bg-gray-50 py-4 flex flex-col gap-3 items-center justify-center">
      <h2 className="text-xl">Hike To Base Hike For</h2>
      <p>{hike.name}</p>
      <p>{hike.date}</p>
      <table>
        <thead className="font-bold text-gray-100">
          <tr>
            <td className="p-4 bg-blue-500 text-center">Hikes</td>
          </tr>
        </thead>
        <tbody>
          {bhl1.map(({ name }, i) => (
            <tr
              key={name}
              className={i % 2 === 0 ? "bg-blue-50" : "bg-blue-100"}
            >
              <td className="text-left pl-2">{name.substring(0, 40)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Hikes;
