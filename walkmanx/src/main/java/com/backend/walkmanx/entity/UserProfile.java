package com.backend.walkmanx.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    private Integer userId;

    private String country;

    private String preferredLanguage;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
}
