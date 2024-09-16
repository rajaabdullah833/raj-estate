import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  
  return (
    <div className="p-3 max-w-lg mx-auto flex flex-col items-center"> {/* Centered container */}
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4 w-full items-center"> {/* Centered form */}
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2"
        />
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg w-full"
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg w-full"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg w-full"
        />
        <button className="bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80 w-full">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5 w-full">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
