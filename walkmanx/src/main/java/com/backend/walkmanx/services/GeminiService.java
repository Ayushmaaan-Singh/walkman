package com.backend.walkmanx.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final ChatClient chatClient;

    public GeminiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    // Added 'language' to the method signature so you can pass it from your Controller
    public String getSearchQueryForMood(String mood, String language) {
        
        // Default to Hindi if the user doesn't specify a language
        String targetLanguage = (language != null && !language.isEmpty()) ? language : "Hindi";

       return this.chatClient.prompt()
    .user(u -> u.text("""
            You are an expert music curator for an app called WalkmanX.
            The user is currently feeling: {mood}. 
            
            Please recommend exactly 10 exceptional {language} songs based on these rules:
            - The FIRST 5 songs MUST perfectly match the mood: {mood}.
            - The NEXT 5 songs MUST be random, highly popular {language} current hit songs of the same mood.
            
            Return the output STRICTLY as a valid JSON array of 10 objects. Do not include markdown formatting or backticks. 
            Each object must have the following keys:
            - "title": The name of the song
            - "artist": The singer or composer
            - "movieOrAlbum": The movie or album it belongs to
            - "vibe_check": A 1-sentence explanation of why it fits.
            """)
            .param("mood", mood)
            .param("language", targetLanguage))
    .call()
    .content();
    }
}