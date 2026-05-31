function Navbar() {
  return (
    <div className="bg-gray-800 text-white p-4 w-[80%] rounded-lg mx-auto mt-4">
      <h1 className="text-2xl font-bold">Navbar</h1>
      <nav className="mt-2">
        <a href="/" className="mr-4 hover:underline">
          Home
        </a>
        <a href="/about" className="hover:underline">
          About
        </a>
      </nav>
    </div>
  );
}

export default Navbar;
