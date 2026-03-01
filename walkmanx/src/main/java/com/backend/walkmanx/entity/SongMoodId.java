package com.backend.walkmanx.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SongMoodId implements Serializable {

    private Integer songId;
    private Integer moodId;
}
