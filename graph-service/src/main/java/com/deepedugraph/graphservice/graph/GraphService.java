package com.deepedugraph.graphservice.graph;

import com.deepedugraph.graphservice.client.EnrollmentClient;
import com.deepedugraph.graphservice.client.WeeklyFeatureClient;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class GraphService {

    private final EnrollmentClient enrollmentClient;
    private final WeeklyFeatureClient featureClient;

    public GraphService(EnrollmentClient enrollmentClient,
                        WeeklyFeatureClient featureClient) {
        this.enrollmentClient = enrollmentClient;
        this.featureClient = featureClient;
    }

    public GraphResponse buildStudentGraph(Long studentId) {
        List<GraphNode> nodes = new ArrayList<>();
        List<GraphEdge> edges = new ArrayList<>();

        String studentNodeId = "student-" + studentId;
        nodes.add(new GraphNode(studentNodeId, "STUDENT", Map.of("id", studentId)));

        List<Map<String,Object>> enrollments = enrollmentClient.byStudent(studentId);
        for (Map<String,Object> e : enrollments) {
            Long courseId = ((Number)e.get("courseId")).longValue();
            String courseNodeId = "course-" + courseId;

            nodes.add(new GraphNode(courseNodeId, "COURSE", e));
            edges.add(new GraphEdge(studentNodeId, courseNodeId, "ENROLLED_IN"));
        }

        List<Map<String,Object>> features = featureClient.byStudent(studentId);
        for (Map<String,Object> f : features) {
            String featureNodeId = "feature-" + f.get("id");
            nodes.add(new GraphNode(featureNodeId, "WEEKLY_FEATURE", f));
            edges.add(new GraphEdge(studentNodeId, featureNodeId, "HAS_FEATURE"));
        }

        return new GraphResponse(nodes, edges);
    }
}

