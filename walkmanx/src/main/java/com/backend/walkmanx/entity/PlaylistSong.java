package com.backend.walkmanx.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "playlist_songs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistSong {

    @EmbeddedId
    private PlaylistSongId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("playlistId") // Connects to the playlistId inside the composite key
    @JoinColumn(name = "playlist_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Playlist playlist;

    // 🚀 The magic column that ensures your songs play in the correct order!
    @Column(name = "song_order")
    private Integer songOrder; 

    // Cached iTunes Data so we don't have to hit the API constantly
    private String title;
    private String artistName;
    private String thumbnailUrl;
    private String previewUrl;
}