package com.deepedugraph.enrollment_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.deepedugraph.enrollment_service", "com.deepedugraph.enrollmentservice"})
@EnableJpaRepositories(basePackages = {"com.deepedugraph.enrollmentservice"})
@EntityScan(basePackages = {"com.deepedugraph.enrollmentservice"})
public class EnrollmentServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EnrollmentServiceApplication.class, args);
	}

}
