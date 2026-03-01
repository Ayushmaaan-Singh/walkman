package com.backend.walkmanx.services;

import com.backend.walkmanx.dto.HomeSongDTO;
import com.backend.walkmanx.entity.Song;
import com.backend.walkmanx.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final SongRepository songRepository;

    private HomeSongDTO map(Song s) {
        return HomeSongDTO.builder()
                .id(s.getId())
                .title(s.getTitle())
                .artistName(s.getArtist() != null ? s.getArtist().getName() : null)
                .albumName(s.getAlbum() != null ? s.getAlbum().getTitle() : null)
                .thumbnailUrl(s.getThumbnailUrl())
                .previewUrl(s.getPreviewUrl())
                .build();
    }

    public List<HomeSongDTO> getHomeSongs() {

        // simplest version → last 12 songs
        return songRepository.findAll()
                .stream()
                .sorted((a,b) -> b.getId().compareTo(a.getId()))
                .limit(12)
                .map(this::map)
                .toList();
    }
}