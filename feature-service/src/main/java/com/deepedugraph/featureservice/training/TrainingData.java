package com.deepedugraph.featureservice.training;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "training_data",
       uniqueConstraints = @UniqueConstraint(columnNames = {"studentId", "courseId", "week"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;
    private Long courseId;
    private Integer week;
    private Integer label;
}
