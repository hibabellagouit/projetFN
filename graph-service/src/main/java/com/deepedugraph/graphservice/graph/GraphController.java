package com.deepedugraph.graphservice.graph;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/graph")
public class GraphController {

    private final GraphService service;

    public GraphController(GraphService service) {
        this.service = service;
    }

    @GetMapping("/student/{studentId}")
    public GraphResponse studentGraph(@PathVariable Long studentId) {
        return service.buildStudentGraph(studentId);
    }
}

