import { useState, useEffect } from "react";
import { catchErrors } from "../utils";
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
  getTopTracks,
} from "../Spotify";
import { ArtistsGrid, TrackList, PlaylistsGrid } from "../components";
import { Link } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile.data);

      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylists(userPlaylists.data);

      const userTopArtists = await getTopArtists();
      setTopArtists(userTopArtists.data);

      const userTopTracks = await getTopTracks();
      setTopTracks(userTopTracks.data);
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
          {topArtists && topTracks && playlists && playlists.items && (
            <main>
              <div title="Top artists this month" seeAllLink="/top-artists">
                <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
              </div>

              <div title="Top tracks this month" seeAllLink="/top-tracks">
                <TrackList tracks={topTracks.items.slice(0, 10)} />
              </div>

              <div title="Playlists" seeAllLink="/playlists">
                {/* <PlaylistsGrid playlists={playlists.items.slice(0, 10)} /> */}
                <>
                  {playlists ? (
                    <ul>
                      {playlists.items.map((playlist, i) => (
                        <li className="grid__item" key={i}>
                          <Link
                            className="grid__item__inner"
                            to={`/playlists/${playlist.id}`}
                          >
                            {playlist.images.length && playlist.images[0] && (
                              <div className="grid__item__img">
                                <img
                                  src={playlist.images[0].url}
                                  alt={playlist.name}
                                />
                              </div>
                            )}
                            <h3 className="grid__item__name overflow-ellipsis">
                              {playlist.name}
                            </h3>
                            <p className="grid__item__label">Playlist</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-notice">No playlists available</p>
                  )}
                </>
              </div>
            </main>
          )}
        </div>
      )}
    </>
  );
}
