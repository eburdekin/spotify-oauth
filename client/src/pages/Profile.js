import { useState, useEffect } from "react";
import { catchErrors } from "../utils";
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
} from "../Spotify";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile.data);

      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylists(userPlaylists.data);

      const userTopArtists = await getTopArtists();
      setTopArtists(userTopArtists.data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <>
      {profile && (
        <div>
          <h1>{profile.display_name}</h1>
          <p>
            {playlists && (
              <span>
                {playlists.total} Playlist{playlists.total !== 1 ? "s" : ""}
              </span>
            )}
            <span>
              {" "}
              {profile.followers.total} Follower
              {profile.followers.total !== 1 ? "s" : ""}
            </span>
          </p>
          {profile.images.length && profile.images[1].url && (
            <img src={profile.images[1].url} alt="Avatar" />
          )}
        </div>
      )}
    </>
  );
}
