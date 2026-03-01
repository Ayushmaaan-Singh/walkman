package com.backend.walkmanx.repository;

import com.backend.walkmanx.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Integer> {

    List<Album> findByTitleContainingIgnoreCase(String title);

    List<Album> findByArtist_Id(Integer artistId);

    List<Album> findByLanguageIgnoreCase(String language);
}
