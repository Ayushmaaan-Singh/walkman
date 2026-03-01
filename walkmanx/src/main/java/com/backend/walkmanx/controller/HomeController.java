package com.backend.walkmanx.controller;

import com.backend.walkmanx.dto.HomeSongDTO;
import com.backend.walkmanx.services.GeminiService;
import com.backend.walkmanx.services.ItunesService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "http://localhost:3000")
public class HomeController {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private ItunesService itunesService;

    @GetMapping("/mood-search")
    public List<HomeSongDTO> searchByMood(
            @RequestParam String mood,
            @RequestParam(required = false) String language) {

        // 🚀 We create it HERE now, bypassing the startup crash!
        ObjectMapper objectMapper = new ObjectMapper();

        String geminiJsonString = geminiService.getSearchQueryForMood(mood, language);
        List<GeminiSongMatch> recommendedSongs = new ArrayList<>();
        
        try {
            recommendedSongs = objectMapper.readValue(
                    geminiJsonString, 
                    new TypeReference<List<GeminiSongMatch>>() {}
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Gemini output", e);
        }

        List<HomeSongDTO> finalPlaylist = new ArrayList<>();
        
        for (GeminiSongMatch aiSong : recommendedSongs) {
            String cleanQuery = aiSong.title() + " " + aiSong.artist();
            Map<String, Object> itunesResponse = itunesService.searchSongs(cleanQuery);
            
            if (itunesResponse != null && itunesResponse.containsKey("results")) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) itunesResponse.get("results");
                
                if (!results.isEmpty()) {
                    Map<String, Object> trackData = results.get(0);
                    
                    HomeSongDTO songDTO = HomeSongDTO.builder()
                            .id(trackData.get("trackId") != null ? ((Number) trackData.get("trackId")).intValue() : null)
                            .title((String) trackData.get("trackName"))
                            .artistName((String) trackData.get("artistName"))
                            .albumName((String) trackData.get("collectionName"))
                            .thumbnailUrl(
    trackData.get("artworkUrl100") != null 
    ? ((String) trackData.get("artworkUrl100")).replace("100x100", "600x600") 
    : null
) 
                            .previewUrl((String) trackData.get("previewUrl"))      
                            .build();
                            
                    finalPlaylist.add(songDTO);
                }
            }
        }
        return finalPlaylist;
    }

    public record GeminiSongMatch(String title, String artist, String movieOrAlbum, String vibe_check) {}
}