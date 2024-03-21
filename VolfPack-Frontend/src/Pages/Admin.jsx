import { useState, useEffect } from "react";
import axios from "axios";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    functions: [],
  });
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    username: "",
    email: "",
    password: "",
    functions: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const addUser = async () => {
    try {
      await axios.post("http://localhost:3001/api/user", newUser);
      setNewUser({ username: "", email: "", password: "", functions: [] });
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (username) => {
    try {
      await axios.delete(`http://localhost:3001/api/delete/${username}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFunctionChangeForNewUser = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewUser((prevUser) => ({
        ...prevUser,
        functions: [...prevUser.functions, value],
      }));
    } else {
      setNewUser((prevUser) => ({
        ...prevUser,
        functions: prevUser.functions.filter((func) => func !== value),
      }));
    }
  };

  const handleFunctionChangeForUpdate = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedUser((prevUser) => ({
        ...prevUser,
        functions: [...prevUser.functions, value],
      }));
    } else {
      setSelectedUser((prevUser) => ({
        ...prevUser,
        functions: prevUser.functions.filter((func) => func !== value),
      }));
    }
  };

  const handleAdminLogin = () => {
    if (
      adminCredentials.username === "ADMIN" &&
      adminCredentials.password === "ADMIN1234"
    ) {
      setShowLoginModal(false);
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedUser({
      username: "",
      email: "",
      password: "",
      functions: [],
    });
  };

  const updateUser = async () => {
    try {
      const { email, functions } = selectedUser;
      const userData = {
        email,
        functions,
      };
      await axios.put(
        `http://localhost:3001/api/update/${selectedUser.username}`,
        userData
      );
      fetchUsers();
      closeUpdateModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">Admin Panel</h1>
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={adminCredentials.username}
              onChange={(e) =>
                setAdminCredentials((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-md mb-4"
            />
            <input
              type="password"
              placeholder="Password"
              value={adminCredentials.password}
              onChange={(e) =>
                setAdminCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-md mb-4"
            />
            <button
              onClick={handleAdminLogin}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          </div>
        </div>
      )}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Update User</h2>
            <form>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={selectedUser.username}
                onChange={(e) =>
                  setSelectedUser((prevUser) => ({
                    ...prevUser,
                    username: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md mb-4"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser((prevUser) => ({
                    ...prevUser,
                    email: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md mb-4"
              />
              <div>
                <label className="mr-2">Table:</label>
                <input
                  type="checkbox"
                  value="table"
                  checked={selectedUser.functions.includes("table")}
                  onChange={handleFunctionChangeForUpdate}
                />
              </div>
              <div>
                <label className="mr-2">Graph:</label>
                <input
                  type="checkbox"
                  value="graph"
                  checked={selectedUser.functions.includes("graph")}
                  onChange={handleFunctionChangeForUpdate}
                />
              </div>
              <div>
                <label className="mr-2">Map:</label>
                <input
                  type="checkbox"
                  value="map"
                  checked={selectedUser.functions.includes("map")}
                  onChange={handleFunctionChangeForUpdate}
                />
              </div>
            </form>
            <div className="flex justify-end">
              <button
                onClick={updateUser}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
              <button
                onClick={closeUpdateModal}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between mb-8">
        <h2 className="text-2xl font-semibold">Add New User</h2>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUser.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
          />
          <div>
            <label className="mr-2">Table:</label>
            <input
              type="checkbox"
              value="table"
              checked={newUser.functions.includes("table")}
              onChange={handleFunctionChangeForNewUser}
            />
          </div>
          <div>
            <label className="mr-2">Graph:</label>
            <input
              type="checkbox"
              value="graph"
              checked={newUser.functions.includes("graph")}
              onChange={handleFunctionChangeForNewUser}
            />
          </div>
          <div>
            <label className="mr-2">Map:</label>
            <input
              type="checkbox"
              value="map"
              checked={newUser.functions.includes("map")}
              onChange={handleFunctionChangeForNewUser}
            />
          </div>
          <button
            onClick={addUser}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add User
          </button>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-4">
            <div className="flex justify-between items-center">
              <span>
                {user.username} - {user.email}
              </span>
              <div className="space-x-4">
                <button
                  onClick={() => deleteUser(user.username)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => openUpdateModal(user)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
