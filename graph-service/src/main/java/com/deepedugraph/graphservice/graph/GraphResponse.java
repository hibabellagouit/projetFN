package com.deepedugraph.graphservice.graph;

import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GraphResponse {
    private List<GraphNode> nodes;
    private List<GraphEdge> edges;
}

