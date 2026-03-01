package com.backend.walkmanx.dto;

public record SearchResultDTO(
    String type,        // Will be "track", "collection" (album), or "artist"
    Integer id,
    String title,
    String artistName,
    String albumName,
    String thumbnailUrl,
    String previewUrl
) {}