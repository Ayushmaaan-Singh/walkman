package com.backend.walkmanx.controller;

import com.backend.walkmanx.dto.SearchResultDTO;
import com.backend.walkmanx.services.ItunesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
 // Keeps the CORS bouncer happy!
public class SearchController {

    @Autowired
    private ItunesService itunesService;

    @GetMapping
    public List<SearchResultDTO> searchMusic(@RequestParam String q) {
        Map<String, Object> itunesResponse = itunesService.searchAllMusic(q);
        List<SearchResultDTO> searchResults = new ArrayList<>();

        if (itunesResponse != null && itunesResponse.containsKey("results")) {
            List<Map<String, Object>> results = (List<Map<String, Object>>) itunesResponse.get("results");

            for (Map<String, Object> item : results) {
                // iTunes tells us what type of media this is
                String wrapperType = (String) item.getOrDefault("wrapperType", "track");
                
                Integer id = null;
                String title = null;
                
                // Extract the right ID and Title depending on the type
                if ("track".equals(wrapperType)) {
                    id = item.get("trackId") != null ? ((Number) item.get("trackId")).intValue() : null;
                    title = (String) item.get("trackName");
                } else if ("collection".equals(wrapperType)) { // "collection" means Album
                    id = item.get("collectionId") != null ? ((Number) item.get("collectionId")).intValue() : null;
                    title = (String) item.get("collectionName");
                } else if ("artist".equals(wrapperType)) {
                    id = item.get("artistId") != null ? ((Number) item.get("artistId")).intValue() : null;
                    title = (String) item.get("artistName");
                }

                // Apply our high-res image hack!
                String thumbnailUrl = null;
                String rawThumbnail = (String) item.get("artworkUrl100");
                if (rawThumbnail != null) {
                    thumbnailUrl = rawThumbnail.replace("100x100", "600x600");
                }

                SearchResultDTO dto = new SearchResultDTO(
                        wrapperType,
                        id,
                        title,
                        (String) item.get("artistName"),
                        (String) item.get("collectionName"),
                        thumbnailUrl,
                        (String) item.get("previewUrl")
                );

                searchResults.add(dto);
            }
        }
        return searchResults;
    }
}