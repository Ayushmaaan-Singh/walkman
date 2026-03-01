package com.backend.walkmanx.repository;

import com.backend.walkmanx.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Integer> {


    List<Artist> findByNameContainingIgnoreCase(String name);
}
