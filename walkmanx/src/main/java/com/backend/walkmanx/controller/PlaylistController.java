package com.backend.walkmanx.controller;

import com.backend.walkmanx.entity.Playlist;
import com.backend.walkmanx.services.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "http://localhost:3000") // Allow Vite to connect
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    // 1. Create a new playlist
    @PostMapping
    public ResponseEntity<Playlist> createPlaylist(@RequestBody CreatePlaylistRequest request) {
        Playlist playlist = playlistService.createPlaylist(
                request.name(), request.mood(), request.thumbnailUrl(), request.userId());
        return ResponseEntity.ok(playlist);
    }

    // 2. Get a single playlist (with all songs perfectly ordered!)
    @GetMapping("/{playlistId}")
    public ResponseEntity<Playlist> getPlaylist(@PathVariable Integer playlistId) {
        return ResponseEntity.ok(playlistService.getPlaylistById(playlistId));
    }

    // 3. Add a song to a playlist
    @PostMapping("/{playlistId}/songs")
    public ResponseEntity<Playlist> addSongToPlaylist(
            @PathVariable Integer playlistId,
            @RequestBody AddSongRequest request) {

        Playlist updatedPlaylist = playlistService.addSongToPlaylist(
                playlistId,
                request.songId(),
                request.title(),
                request.artistName(),
                request.thumbnailUrl(),
                request.previewUrl());
        return ResponseEntity.ok(updatedPlaylist);
    }

    // 4. Get all playlists for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Playlist>> getUserPlaylists(@PathVariable Integer userId) {
        return ResponseEntity.ok(playlistService.getUserPlaylists(userId));
    }

    // --- DTOs to map incoming JSON requests from React ---
    public record CreatePlaylistRequest(String name, String mood, String thumbnailUrl, Integer userId) {
    }

    public record AddSongRequest(
            Integer songId,
            String title,
            String artistName,
            String thumbnailUrl,
            String previewUrl) {
    }
}