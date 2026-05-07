package com.studentmanager.common;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET = "MySecretKeyMySecretKeyMySecretKey123";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());
    // 过期时间：2小时
    private final long EXPIRATION = 1000 * 60 * 60 * 2;

    public String generateToken(String username, String role) {
        return Jwts
                .builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUsername(String token) {
        return parseToken(token).getSubject();
    }

    public boolean isExpired(String token) {
        return parseToken(token).getExpiration().before(new Date());
    }
}
