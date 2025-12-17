import { useParams } from "react-router";

const UserPage = () => {
  const { userId } = useParams();
  return (
    <div className="bg-lime-500 flex flex-col h-full gap-4">
      <p>User Id is :: {userId}</p>
      <div className="bg-red-400 flex gap-1 items-center mx-1 rounded-md">
        <div className="m-1 bg-yellow-500 w-24 h-24 flex items-center justify-center rounded-full">
          <p className="text-4xl">DW</p>
        </div>
        <div className="bg-purple-500 flex-1 flex flex-col gap-3 p-2">
          <p className="text-2xl">Dilip Woad</p>
          <p>dil2g.com</p>
        </div>
      </div>

      <div className="flex justify-between sm:justify-start gap-4 overflow-auto mx-2 bg-slate-400 p-2">
        <button className="sm:px-5 py-1 px-2 text-nowrap text-sm font-semibold bg-white text-black rounded-md">All Tasks</button>
        <button className="sm:px-5 py-1 px-2 text-nowrap text-sm font-semibold bg-white text-black rounded-md">Today's Tasks</button>
        <button className="sm:px-5 py-1 px-2 text-nowrap text-sm font-semibold bg-white text-black rounded-md">Completed</button>
        <button className="sm:px-5 py-1 px-2 text-nowrap text-sm font-semibold bg-white text-black rounded-md">In-progress</button>
        <button className="sm:px-5 py-1 px-2 text-nowrap text-sm font-semibold bg-white text-black rounded-md">Past Due</button>
      </div>
      <div className="bg-sky-500 flex-1 mx-1 rounded-md">Main Div with Task Card Display</div>
    </div>
  );
};

export default UserPage;
