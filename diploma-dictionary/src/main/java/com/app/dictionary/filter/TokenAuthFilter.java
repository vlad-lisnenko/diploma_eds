package com.app.dictionary.filter;

import com.app.dictionary.client.UsersClient;
import com.app.dictionary.client.request.TokenSummary;
import com.app.dictionary.client.request.TokenSummaryRequest;
import com.app.dictionary.model.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class TokenAuthFilter extends OncePerRequestFilter {
    private final UsersClient usersClient;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        TokenSummary tokenSummary = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            tokenSummary = usersClient.findTokenSummaryByToken(new TokenSummaryRequest(authHeader.substring(7)));
        }

        if (tokenSummary != null && SecurityContextHolder.getContext().getAuthentication() == null &&
                tokenSummary.getValid()) {
            if (!tokenSummary.getExpired()) {
                UserDetails userDetails = new UserDetailsImpl(tokenSummary);
                UsernamePasswordAuthenticationToken authentication = new
                        UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}

