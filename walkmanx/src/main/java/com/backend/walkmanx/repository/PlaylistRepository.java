package com.backend.walkmanx.repository;

import com.backend.walkmanx.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {

    List<Playlist> findByUser_Id(Integer userId);
}
