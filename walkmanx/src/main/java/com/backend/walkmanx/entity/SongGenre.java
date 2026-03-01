package com.backend.walkmanx.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "song_genres")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SongGenre {

    @EmbeddedId
    private SongGenreId id;

    @ManyToOne
    @MapsId("songId")
    @JoinColumn(name = "song_id")
    private Song song;

    @ManyToOne
    @MapsId("genreId")
    @JoinColumn(name = "genre_id")
    private Genre genre;
}
