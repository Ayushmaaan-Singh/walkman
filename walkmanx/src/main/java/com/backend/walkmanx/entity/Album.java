package com.backend.walkmanx.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "albums")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    private String language;

    private String thumbnailUrl;

    private Integer releaseYear;



    @ManyToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;
}
