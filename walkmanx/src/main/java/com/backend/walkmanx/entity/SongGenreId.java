package com.backend.walkmanx.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SongGenreId implements Serializable {

    private Integer songId;
    private Integer genreId;
}
