package com.backend.walkmanx.repository;

import com.backend.walkmanx.entity.ListeningHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListeningHistoryRepository extends JpaRepository<ListeningHistory, Integer> {

    List<ListeningHistory> findByUser_Id(Integer userId);

    List<ListeningHistory> findBySong_Id(Integer songId);
}
