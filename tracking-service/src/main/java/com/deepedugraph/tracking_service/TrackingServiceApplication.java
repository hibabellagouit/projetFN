package com.deepedugraph.tracking_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.deepedugraph.tracking_service", "com.deepedugraph.trackingservice"})
@EnableJpaRepositories(basePackages = {"com.deepedugraph.trackingservice"})
@EntityScan(basePackages = {"com.deepedugraph.trackingservice"})
public class TrackingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrackingServiceApplication.class, args);
	}

}
