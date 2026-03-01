package com.backend.walkmanx.controller;

import com.backend.walkmanx.dto.SongResponse;
import com.backend.walkmanx.services.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    // 🔍 search by title
    @GetMapping("/search")
    public List<SongResponse> search(@RequestParam("q") String q) {
        return songService.searchSongs(q);
    }

    // 🎤 songs by artist
    @GetMapping("/artist/{artistId}")
    public List<SongResponse> byArtist(@PathVariable("artistId")  Integer artistId) {
        return songService.getSongsByArtist(artistId);
    }

    // 🌐 songs by language
    @GetMapping("/language/{lang}")
    public List<SongResponse> byLanguage(@PathVariable("lang") String lang) {
        return songService.getSongsByLanguage(lang);
    }
}
