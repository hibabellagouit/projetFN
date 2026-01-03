package com.deepedugraph.graphservice.graph;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GraphEdge {
    private String source;
    private String target;
    private String type;
}

