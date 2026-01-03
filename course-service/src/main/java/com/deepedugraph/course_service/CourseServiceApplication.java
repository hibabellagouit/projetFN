package com.deepedugraph.course_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.deepedugraph.course_service", "com.deepedugraph.courseservice"})
@EnableJpaRepositories(basePackages = {"com.deepedugraph.courseservice"})
@EntityScan(basePackages = {"com.deepedugraph.courseservice"})
public class CourseServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CourseServiceApplication.class, args);
	}

}
