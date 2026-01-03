package com.deepedugraph.feature_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.deepedugraph.feature_service", "com.deepedugraph.featureservice"})
@EnableJpaRepositories(basePackages = {"com.deepedugraph.featureservice"})
@EntityScan(basePackages = {"com.deepedugraph.featureservice"})
public class FeatureServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FeatureServiceApplication.class, args);
	}

}
