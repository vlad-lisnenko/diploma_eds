package com.app.dictionary.config;

import com.app.dictionary.filter.TokenAuthFilter;
import com.app.dictionary.model.UserAuthority;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final TokenAuthFilter tokenAuthFilter;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "OPTIONS", "PATCH");
            }
        };
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf()
                .disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.POST, "/{firstLanguage}/{secondLanguage}").hasAuthority(UserAuthority.ALL.getAuthority())
                .antMatchers(HttpMethod.PUT, "/{firstLanguage}/{secondLanguage}/{id}").hasAuthority(UserAuthority.ALL.getAuthority())
                .antMatchers(HttpMethod.DELETE, "/{firstLanguage}/{secondLanguage}/{id}").hasAuthority(UserAuthority.ALL.getAuthority())
                .antMatchers(HttpMethod.POST, "/languages/**").hasAuthority(UserAuthority.ALL.getAuthority())
                .antMatchers(HttpMethod.PUT, "/languages/**").hasAuthority(UserAuthority.ALL.getAuthority())
                .antMatchers(HttpMethod.DELETE, "/languages/**").hasAuthority(UserAuthority.ALL.getAuthority())
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .cors();

        http.addFilterBefore(tokenAuthFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
