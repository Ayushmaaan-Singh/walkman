package com.backend.walkmanx.services;

import com.backend.walkmanx.entity.Playlist;
import com.backend.walkmanx.entity.PlaylistSong;
import com.backend.walkmanx.entity.PlaylistSongId;
import com.backend.walkmanx.entity.User;
import com.backend.walkmanx.repository.PlaylistRepository;
import com.backend.walkmanx.repository.PlaylistSongRepository;
import com.backend.walkmanx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final UserRepository userRepository;

    // 1. Create a new empty playlist tied to a User
    public Playlist createPlaylist(String name, String mood, String thumbnailUrl, Integer userId) {
        Playlist playlist = new Playlist();
        playlist.setName(name);
        playlist.setMood(mood);
        playlist.setThumbnailUrl(thumbnailUrl);
        playlist.setCreatedAt(LocalDateTime.now());

        // 🚀 Fix: Safely fetch the user or throw a clear error
        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
            playlist.setUser(user);
        }

        return playlistRepository.save(playlist);
    }

    // 2. Fetch a playlist (Songs will automatically be in order!)
    public Playlist getPlaylistById(Integer playlistId) {
        return playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found with ID: " + playlistId));
    }

    // 3. Add a song to the end of the playlist queue
    @Transactional
    public Playlist addSongToPlaylist(Integer playlistId, Integer songId, String title,
                                      String artistName, String thumbnailUrl, String previewUrl) {

        Playlist playlist = getPlaylistById(playlistId);

        PlaylistSongId compositeKey = new PlaylistSongId(playlistId, songId);
        if (playlistSongRepository.existsById(compositeKey)) {
            throw new RuntimeException("Song is already in this playlist!");
        }

        int nextOrder = playlist.getSongs().size() + 1;

        PlaylistSong newSong = new PlaylistSong();
        newSong.setId(compositeKey);
        newSong.setPlaylist(playlist);
        newSong.setSongOrder(nextOrder);

        newSong.setTitle(title);
        newSong.setArtistName(artistName);
        newSong.setThumbnailUrl(thumbnailUrl);
        newSong.setPreviewUrl(previewUrl);

        playlist.getSongs().add(newSong);
        return playlistRepository.save(playlist);
    }

    // 4. Get all playlists for a specific user
   // 4. Get all playlists for a specific user
    public List<Playlist> getUserPlaylists(Integer userId) {
        return playlistRepository.findByUser_Id(userId); // ✅ FIXED!
    }
    }
