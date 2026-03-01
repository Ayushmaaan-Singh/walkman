package com.backend.walkmanx.repository;

import com.backend.walkmanx.entity.PlaylistSong;
import com.backend.walkmanx.entity.PlaylistSongId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, PlaylistSongId> {
    // We can add custom queries here later if needed
}