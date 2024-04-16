import { hikes, colorsLevel, levels } from "../../db/seedBaseHikes";

async function Stats() {
  return (
    <main className="max-w-xl mx-auto bg-gray-50 py-4 flex flex-col gap-3 items-center justify-center">
      <p>Base Hikes</p>
      <table>
        <thead className="font-bold text-gray-100">
          <tr>
            <td className="p-4 bg-blue-400">Level</td>
            <td className="p-4 bg-blue-500 text-center">Name</td>
          </tr>
        </thead>
        <tbody>
          {hikes.map((hikeLevel, level) => (
            <tr key={level}>
              <td
                className={`${level % 2 ? "bg-blue-200" : "bg-blue-300"} p-2`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div>{level + 1}</div>
                  <div>{levels[level]}</div>
                  <div>{colorsLevel[level]}</div>
                </div>
              </td>
              <td>
                <table className="w-full">
                  <tbody>
                    {hikeLevel.map((hike, idx) => (
                      <tr key={idx}>
                        {hike.map((v, i) => (
                          <td
                            className={`${
                              idx % 2 ? "bg-gray-200" : "bg-gray-300"
                            } p-2 text-right`}
                            key={i}
                          >
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default Stats;
