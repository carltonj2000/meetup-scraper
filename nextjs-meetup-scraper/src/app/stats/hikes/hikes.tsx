"use client";
import { HikeT } from "@/schema";
import Link from "next/link";

const getHref = (hikeId: number) =>
  `http://localhost:3000/stats/hikes/to-base-hike/${hikeId}`;

function Hikes({ hks }: { hks: HikeT[] }) {
  return (
    <table>
      <thead className="font-bold text-gray-100">
        <tr>
          <td className="p-4 bg-blue-500 text-center">Hikes</td>
        </tr>
      </thead>
      <tbody>
        {hks.map(({ name, id }, i) => (
          <tr key={id} className={i % 2 === 0 ? "bg-blue-50" : "bg-blue-100"}>
            <td className="text-left pl-2">
              <Link href={getHref(id)}>{name.substring(0, 50)}</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Hikes;
