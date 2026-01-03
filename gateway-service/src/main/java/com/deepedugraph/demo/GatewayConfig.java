package com.deepedugraph.demo;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/auth/**")
                        .uri("http://localhost:8081"))
                .route("student-service", r -> r
                        .path("/students/**")
                        .uri("http://localhost:8082"))
                .route("course-service", r -> r
                        .path("/courses/**")
                        .uri("http://localhost:8083"))
                .route("tracking-service", r -> r
                        .path("/tracking/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("http://localhost:8084"))
                .route("enrollment-service", r -> r
                        .path("/enrollments/**")
                        .uri("http://localhost:8085"))
                .route("feature-service", r -> r
                        .path("/weekly-features/**")
                        .uri("http://localhost:8086"))
                .route("graph-service", r -> r
                        .path("/graph/**")
                        .uri("http://localhost:8087"))
                .build();
    }
}

