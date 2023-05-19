package com.app.dictionary.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquivalentWordDefinition {
    @Size(max = 50)
    private String precedingComment;

    @Size(max = 50)
    private String definition;
}
