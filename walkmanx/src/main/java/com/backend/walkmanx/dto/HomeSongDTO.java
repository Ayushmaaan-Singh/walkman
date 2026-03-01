package com.backend.walkmanx.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HomeSongDTO {

    private Integer id;
    private String title;
    private String artistName;
    private String albumName;
    private String thumbnailUrl;
    private String previewUrl;
}