package com.filatov.userservice.security;

import com.filatov.userservice.filter.TokenAuthFilter;
import com.filatov.userservice.model.UserAuthority;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                .antMatchers("/token/**").permitAll()
                .antMatchers("/password").authenticated()
                .antMatchers("/{id}").hasAuthority(UserAuthority.ROOT.getAuthority())
                .antMatchers("/").hasAuthority(UserAuthority.ROOT.getAuthority())
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .cors();

        http.addFilterBefore(tokenAuthFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
