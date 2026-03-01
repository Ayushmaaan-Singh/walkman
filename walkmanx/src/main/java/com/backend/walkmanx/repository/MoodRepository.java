package com.backend.walkmanx.repository;

import com.backend.walkmanx.entity.Mood;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MoodRepository extends JpaRepository<Mood, Integer> {

    Optional<Mood> findByNameIgnoreCase(String name);
}
