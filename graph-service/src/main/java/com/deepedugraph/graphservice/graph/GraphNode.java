package com.deepedugraph.graphservice.graph;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GraphNode {
    private String id;
    private String type;
    private Object data;
}

