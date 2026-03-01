package com.backend.walkmanx.repository;

import com.backend.walkmanx.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface SongRepository extends JpaRepository<Song, Integer> {

    // search by song title
    List<Song> findByTitleContainingIgnoreCase(String title);

    // filter by artist
    List<Song> findByArtist_Id(Integer artistId);

    // filter by album
    List<Song> findByAlbum_Id(Integer albumId);

    // filter by language
    List<Song> findByLanguageIgnoreCase(String language);

    // search language text (e.g. user types "hin")
    List<Song> findByLanguageContainingIgnoreCase(String language);

    // ✅ filter by genre (FIXED JPQL)
   
   
Optional<Song> findByItunesId(Long itunesId);

    // filter by artist + language
    List<Song> findByArtist_IdAndLanguageIgnoreCase(Integer artistId, String language);
}
