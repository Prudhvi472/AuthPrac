import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  user: string;
  password: string;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users', {
            withCredentials: true,
          });

        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-9xl">Logged In!</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.user}</li>
          // Adjust the property names based on your actual user data structure
        ))}
      </ul>
    </div>
  );
};

export default Home;
