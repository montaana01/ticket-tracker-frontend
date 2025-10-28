import { fetchRequest } from '../../../helpers/fetchRequest.ts';

export const ProfilePage = () => {
  let profile;
  fetchRequest('/api/user/profile')
    .then((data) => {
      profile = data;
    })
    .catch(() => console.error('Error fetching user'));

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Profile</h1>
      <p>
        <strong>ID:</strong> {profile.id}
      </p>
      <p>
        <strong>Login:</strong> {profile.username}
      </p>
      <p>
        <strong>Role:</strong> {profile.role}
      </p>
    </div>
  );
};
