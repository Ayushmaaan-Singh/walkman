package com.backend.walkmanx.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ItunesService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> searchSongs(String query) {

        String url = "https://itunes.apple.com/search?term=" +
                query.replace(" ", "+") +
                "&entity=song&limit=10";

        // fetch as raw string
        String response = restTemplate.getForObject(url, String.class);

        try {
            // convert JSON string → Map
            return objectMapper.readValue(response, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse iTunes response", e);
        }
    }
    public Map<String, Object> searchAllMusic(String query) {
        // limit=30 gives a nice mix of artists, albums, and tracks
        String url = "https://itunes.apple.com/search?term=" +
                query.replace(" ", "+") +
                "&media=music&limit=30";

        String response = restTemplate.getForObject(url, String.class);

        try {
            return objectMapper.readValue(response, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse iTunes response", e);
        }
    }
}