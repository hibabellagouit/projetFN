package com.deepedugraph.auth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.deepedugraph.auth_service", "com.deepedugraph.authservice"})
@EnableJpaRepositories(basePackages = {"com.deepedugraph.authservice"})
@EntityScan(basePackages = {"com.deepedugraph.authservice"})
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

}
