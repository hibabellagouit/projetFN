package com.deepedugraph.featureservice.weekly;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "weekly_features",
       uniqueConstraints = @UniqueConstraint(columnNames = {"studentId","courseId","week"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyFeature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;
    private Long courseId;
    private Integer week;

    private Integer totalEvents;
    private Integer logins;
    private Integer resourceViews;
    private Integer submissions;
}

