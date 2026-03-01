package com.backend.walkmanx.services;

import com.backend.walkmanx.dto.SongResponse;
import com.backend.walkmanx.entity.*;
import com.backend.walkmanx.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;
    private final ItunesService itunesService;

    // ---------------- MAP TO DTO ----------------
    private SongResponse mapToResponse(Song s) {
        return SongResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .artistName(s.getArtist() != null ? s.getArtist().getName() : null)
                .albumName(s.getAlbum() != null ? s.getAlbum().getTitle() : null)
                .language(s.getLanguage())
                .duration(s.getDuration())
                .thumbnailUrl(s.getThumbnailUrl())
                .previewUrl(s.getPreviewUrl())
                .build();
    }

    // ---------------- SEARCH ----------------
    public List<SongResponse> searchSongs(String query) {

        // 1️⃣ SEARCH LOCAL DB FIRST
        List<Song> local = songRepository.findByTitleContainingIgnoreCase(query);

        if (!local.isEmpty()) {
            return local.stream().map(this::mapToResponse).toList();
        }

        // 2️⃣ CALL ITUNES API
        Map<String, Object> data = itunesService.searchSongs(query);
        List<Map<String, Object>> results =
                (List<Map<String, Object>>) data.get("results");

        if (results == null || results.isEmpty()) {
            return List.of();
        }

        // 3️⃣ SAVE RESULTS TO DB
        List<Song> savedSongs = results.stream().map(track -> {

            Long itunesId = ((Number) track.get("trackId")).longValue();

            // skip if already exists
            return songRepository.findByItunesId(itunesId).orElseGet(() -> {

                String title = (String) track.get("trackName");
                String artistName = (String) track.get("artistName");
                String albumName = (String) track.get("collectionName");

                // ---------- ARTIST ----------
                Artist artist = artistRepository.findAll()
                        .stream()
                        .filter(a -> a.getName().equalsIgnoreCase(artistName))
                        .findFirst()
                        .orElseGet(() -> {
                            Artist a = new Artist();
                            a.setName(artistName);
                            return artistRepository.save(a);
                        });

                // ---------- ALBUM ----------
                Album album = null;
                if (albumName != null) {
                    album = albumRepository.findAll()
                            .stream()
                            .filter(a -> a.getTitle().equalsIgnoreCase(albumName))
                            .findFirst()
                            .orElseGet(() -> {
                                Album al = new Album();
                                al.setTitle(albumName);
                                al.setArtist(artist);
                                return albumRepository.save(al);
                            });
                }

                // ---------- SONG ----------
                Song song = new Song();
                song.setTitle(title);
                song.setItunesId(itunesId);
                song.setArtist(artist);
                song.setAlbum(album);

                // duration conversion
                if (track.get("trackTimeMillis") != null) {
                    int seconds =
                            ((Number) track.get("trackTimeMillis")).intValue() / 1000;
                    song.setDuration(seconds);
                }

                song.setPreviewUrl((String) track.get("previewUrl"));
                song.setThumbnailUrl((String) track.get("artworkUrl100"));
                song.setCreatedAt(LocalDateTime.now());

                return songRepository.save(song);
            });

        }).toList();

        // 4️⃣ RETURN DTOs
        return savedSongs.stream().map(this::mapToResponse).toList();
    }

    // ---------------- FILTERS (UNCHANGED) ----------------
    public List<SongResponse> getSongsByArtist(Integer artistId) {
        return songRepository.findByArtist_Id(artistId)
                .stream().map(this::mapToResponse).toList();
    }

    public List<SongResponse> getSongsByLanguage(String language) {
        return songRepository.findByLanguageIgnoreCase(language)
                .stream().map(this::mapToResponse).toList();
    }
}
